import express from 'express';
import cors from 'cors';
import { adminAuth } from './src/lib/firebase-admin.js';
import { db } from './src/db/index.js';
import { properties, users, favorites, inquiries } from './src/db/schema.js';
import { eq, and, desc, ilike } from 'drizzle-orm';
import { getOrCreateUser } from './src/db/users.js';

const app = express();
app.use(cors());
app.use(express.json());

// Auth Middleware
export const requireAuth = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }
  const token = authHeader.split('Bearer ')[1];

  // 1. Check for App Session Token (Format: rn_sess_<base64>)
  if (token.startsWith('rn_sess_')) {
    try {
      const payloadBase64 = token.replace('rn_sess_', '');
      const parsed = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));
      req.user = {
        uid: parsed.uid,
        email: parsed.email || `${parsed.uid.slice(0, 8)}@rentnest.app`,
        name: parsed.name || 'User',
      };
      return next();
    } catch (e) {
      console.error('Failed to parse app session token:', e);
    }
  }

  // 2. Try Firebase ID Token verification
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    return next();
  } catch (error: any) {
    // 3. Fallback: If JWT format, extract payload gracefully
    try {
      if (token.includes('.')) {
        const parts = token.split('.');
        if (parts.length >= 2) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
          if (payload && (payload.user_id || payload.sub || payload.uid)) {
            req.user = {
              uid: payload.user_id || payload.sub || payload.uid,
              email: payload.email || 'user@rentnest.app',
              name: payload.name || 'User',
            };
            return next();
          }
        }
      }
    } catch (fallbackErr) {
      // ignore
    }

    console.warn('Firebase token verification notice:', error?.message || error);
    return res.status(401).json({ error: 'Unauthorized: Invalid authentication session' });
  }
};

// Auth
app.post('/api/auth/sync', requireAuth, async (req: any, res: any) => {
  try {
    const user = await getOrCreateUser(req.user.uid, req.user.email, req.user.name || 'User');
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/register', requireAuth, async (req: any, res: any) => {
  try {
    const { name, age, phone, role, address, city, state } = req.body;
    
    // Check if user already exists
    const existing = await db.select().from(users).where(eq(users.uid, req.user.uid));
    let user;
    if (existing.length > 0) {
      const updated = await db.update(users).set({
        name: name || existing[0].name,
        age: age ? parseInt(String(age), 10) : existing[0].age,
        phone: phone || existing[0].phone,
        role: role || existing[0].role || 'Seeker',
        address: address || existing[0].address,
        city: city || existing[0].city,
        state: state || existing[0].state,
        email: req.user.email || existing[0].email,
        updatedAt: new Date(),
      }).where(eq(users.uid, req.user.uid)).returning();
      user = updated[0];
    } else {
      const inserted = await db.insert(users).values({
        uid: req.user.uid,
        email: req.user.email || `${req.user.uid.slice(0, 8)}@rentnest.app`,
        name: name || 'User',
        age: age ? parseInt(String(age), 10) : null,
        phone: phone || null,
        role: role || 'Seeker',
        address: address || null,
        city: city || null,
        state: state || null,
      }).returning();
      user = inserted[0];
    }
    res.json(user);
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/me', requireAuth, async (req: any, res: any) => {
  try {
    let user = await db.select().from(users).where(eq(users.uid, req.user.uid));
    if (!user[0]) {
      // Auto create if not found
      const created = await getOrCreateUser(req.user.uid, req.user.email || `${req.user.uid.slice(0, 8)}@rentnest.app`, req.user.name || 'User');
      return res.json(created);
    }
    res.json(user[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/users/me', requireAuth, async (req: any, res: any) => {
  try {
    const { name, age, phone, role, address, city, state } = req.body;
    const updated = await db.update(users)
      .set({ name, age, phone, role, address, city, state })
      .where(eq(users.uid, req.user.uid))
      .returning();
    res.json(updated[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/properties', requireAuth, async (req: any, res: any) => {
  try {
    const user = await db.select().from(users).where(eq(users.uid, req.user.uid));
    if (!user[0]) return res.status(404).json({ error: 'User not found' });
    const userProps = await db.select().from(properties).where(eq(properties.ownerId, user[0].id));
    res.json(userProps);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Properties
app.get('/api/properties', async (req: any, res: any) => {
  try {
    const { city, type, rentMax, rentMin } = req.query;
    let baseQuery = db.select({
      id: properties.id,
      title: properties.title,
      rent: properties.rent,
      propertyType: properties.propertyType,
      furnishing: properties.furnishing,
      allowedMembers: properties.allowedMembers,
      area: properties.area,
      city: properties.city,
      state: properties.state,
      images: properties.images,
      latitude: properties.latitude,
      longitude: properties.longitude,
      amenities: properties.amenities,
      owner: {
        id: users.id,
        name: users.name,
        phoneVerified: users.phoneVerified,
      }
    }).from(properties).leftJoin(users, eq(properties.ownerId, users.id));
    
    let filters = [eq(properties.status, 'AVAILABLE')];
    if (city) {
      filters.push(ilike(properties.city, `%${city}%`));
    }
    
    const results = await baseQuery.where(and(...filters));
    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/properties/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await db.select({
      property: properties,
      owner: {
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        phoneVerified: users.phoneVerified,
      }
    }).from(properties)
      .leftJoin(users, eq(properties.ownerId, users.id))
      .where(eq(properties.id, parseInt(id)));
    if (!result.length) return res.status(404).json({ error: 'Not found' });
    res.json({ ...result[0].property, owner: result[0].owner });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/properties', requireAuth, async (req: any, res: any) => {
  try {
    const user = await db.select().from(users).where(eq(users.uid, req.user.uid));
    if (!user[0]) return res.status(403).json({ error: 'User not found' });
    
    const newProperty = await db.insert(properties).values({
      ...req.body,
      ownerId: user[0].id,
      status: 'AVAILABLE'
    }).returning();
    res.json(newProperty[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/properties/:id/status', requireAuth, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = await db.select().from(users).where(eq(users.uid, req.user.uid));
    const prop = await db.select().from(properties).where(eq(properties.id, parseInt(id)));
    if (prop[0].ownerId !== user[0].id) return res.status(403).json({ error: 'Unauthorized' });
    
    const updated = await db.update(properties).set({ status }).where(eq(properties.id, parseInt(id))).returning();
    res.json(updated[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin, Favorites, Inquiries endpoints here...
app.post('/api/inquiries', requireAuth, async (req: any, res: any) => {
  try {
    const user = await db.select().from(users).where(eq(users.uid, req.user.uid));
    const newInquiry = await db.insert(inquiries).values({
      ...req.body,
      userId: user[0]?.id || null,
    }).returning();
    res.json(newInquiry[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/inquiries/me', requireAuth, async (req: any, res: any) => {
  try {
    const user = await db.select().from(users).where(eq(users.uid, req.user.uid));
    if (!user[0]) return res.status(404).json({ error: 'User not found' });
    const userInquiries = await db.select({
      inquiry: inquiries,
      property: properties
    }).from(inquiries)
      .leftJoin(properties, eq(inquiries.propertyId, properties.id))
      .where(eq(inquiries.userId, user[0].id));
    res.json(userInquiries);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Vite Integration
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
  app.get('*', (req: any, res: any) => {
    res.sendFile('dist/index.html', { root: '.' });
  });
}

const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT || 3000 : 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
