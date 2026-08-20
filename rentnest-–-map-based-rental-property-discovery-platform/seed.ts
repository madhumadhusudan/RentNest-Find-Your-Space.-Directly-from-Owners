import { getOrCreateUser } from './src/db/users.js';
import { properties, users } from './src/db/schema.js';
import { db } from './src/db/index.js';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log("Seeding database with rich demo data...");
  
  // Create Demo Owners
  const owner1 = await getOrCreateUser('demo-owner-blr', 'blr@rentnest.test', 'Rajesh Kumar');
  const owner2 = await getOrCreateUser('demo-owner-mum', 'mum@rentnest.test', 'Priya Sharma');
  
  // Ensure they have the 'Owner' role
  await db.update(users).set({ role: 'Owner' }).where(eq(users.id, owner1.id));
  await db.update(users).set({ role: 'Owner' }).where(eq(users.id, owner2.id));

  const sampleProperties = [
    {
      ownerId: owner1.id,
      title: "Premium 3 BHK in Indiranagar",
      description: "Luxurious fully furnished 3 BHK apartment in the heart of Indiranagar. Walking distance to 100ft road, metro station, and top restaurants. Includes dedicated covered parking and 24/7 security.",
      propertyType: "3 BHK",
      furnishing: "Fully Furnished",
      rent: 65000,
      area: "Indiranagar",
      city: "Bangalore",
      state: "Karnataka",
      latitude: 12.9784,
      longitude: 77.6408,
      status: "AVAILABLE",
      images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000&auto=format&fit=crop"],
      amenities: ["AC", "WiFi", "Gym", "Parking"]
    },
    {
      ownerId: owner1.id,
      title: "Cozy 1 BHK in Koramangala",
      description: "Perfect for bachelors or young couples. Semi-furnished 1 BHK with excellent ventilation. Close to Sony World signal and major tech parks.",
      propertyType: "1 BHK",
      furnishing: "Semi Furnished",
      rent: 22000,
      area: "Koramangala",
      city: "Bangalore",
      state: "Karnataka",
      latitude: 12.9352,
      longitude: 77.6245,
      status: "AVAILABLE",
      images: ["https://images.unsplash.com/photo-1502672260266-1c1de2d96674?q=80&w=2000&auto=format&fit=crop"],
      amenities: ["Power Backup", "Security"]
    },
    {
      ownerId: owner2.id,
      title: "Sea-View 2 BHK in Bandra West",
      description: "Stunning 2 BHK apartment with unrestricted views of the Arabian Sea. Fully air-conditioned, modular kitchen, and premium fittings throughout.",
      propertyType: "2 BHK",
      furnishing: "Fully Furnished",
      rent: 110000,
      area: "Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      latitude: 19.0596,
      longitude: 72.8295,
      status: "AVAILABLE",
      images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop"],
      amenities: ["Sea View", "AC", "Lift", "Security"]
    },
    {
      ownerId: owner2.id,
      title: "Affordable 1 RK in Andheri East",
      description: "Compact and well-maintained 1 RK near the metro station. Unfurnished, allowing you to set it up your way. 24-hour water supply.",
      propertyType: "1 RK",
      furnishing: "Unfurnished",
      rent: 18000,
      area: "Andheri East",
      city: "Mumbai",
      state: "Maharashtra",
      latitude: 19.1136,
      longitude: 72.8697,
      status: "AVAILABLE",
      images: ["https://images.unsplash.com/photo-1536376072261-38c75010e6c9?q=80&w=2000&auto=format&fit=crop"],
      amenities: ["Water Supply"]
    },
    {
      ownerId: owner1.id,
      title: "Spacious Tech-Park Facing 2 BHK",
      description: "Modern apartment located right next to Manyata Tech Park. Ideal for IT professionals. Includes modular kitchen and built-in wardrobes.",
      propertyType: "2 BHK",
      furnishing: "Semi Furnished",
      rent: 32000,
      area: "Hebbal",
      city: "Bangalore",
      state: "Karnataka",
      latitude: 13.0358,
      longitude: 77.5970,
      status: "AVAILABLE",
      images: ["https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2000&auto=format&fit=crop"],
      amenities: ["Gym", "Pool", "Parking"]
    }
  ];

  for (const p of sampleProperties) {
    await db.insert(properties).values(p);
  }
  
  console.log("Seeding complete! Added rich properties.");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seeding failed", err);
  process.exit(1);
});
