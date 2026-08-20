import { relations } from 'drizzle-orm';
import { boolean, doublePrecision, integer, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  name: text('name').notNull(),
  age: integer('age'),
  email: text('email').notNull(),
  phone: text('phone'),
  role: text('role').notNull().default('Seeker'), // 'Owner' | 'Seeker'
  address: text('address'),
  city: text('city'),
  state: text('state'),
  emailVerified: boolean('email_verified').default(false),
  phoneVerified: boolean('phone_verified').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const properties = pgTable('properties', {
  id: serial('id').primaryKey(),
  ownerId: integer('owner_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  propertyType: text('property_type').notNull(), // '1 BHK' | '2 BHK' | etc
  furnishing: text('furnishing').notNull(), // 'Fully Furnished' | 'Semi Furnished' | 'Unfurnished'
  rent: integer('rent').notNull(),
  negotiable: boolean('negotiable').default(false),
  allowedMembers: integer('allowed_members'),
  tenantType: text('tenant_type'), // 'Bachelor' | 'Family' | 'Anyone' etc
  address: text('address'),
  area: text('area'),
  city: text('city'),
  state: text('state'),
  pincode: text('pincode'),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  status: text('status').default('AVAILABLE'), // 'AVAILABLE' | 'RENTED' | 'HIDDEN'
  images: text('images').array(), // store array of URLs
  amenities: text('amenities').array(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  propertyId: integer('property_id').references(() => properties.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  propertyId: integer('property_id').references(() => properties.id).notNull(),
  userId: integer('user_id').references(() => users.id),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  properties: many(properties),
  favorites: many(favorites),
  inquiries: many(inquiries),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  owner: one(users, { fields: [properties.ownerId], references: [users.id] }),
  favorites: many(favorites),
  inquiries: many(inquiries),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, { fields: [favorites.userId], references: [users.id] }),
  property: one(properties, { fields: [favorites.propertyId], references: [properties.id] }),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  user: one(users, { fields: [inquiries.userId], references: [users.id] }),
  property: one(properties, { fields: [inquiries.propertyId], references: [properties.id] }),
}));
