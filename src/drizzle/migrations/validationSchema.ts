import {z} from 'zod';

// Masjid validation schema
export const masjidSchema = z.object({
    name: z.string().min(1).max(255),
    email: z.string().email().max(255),
    password: z.string().min(8).max(255),
    address: z.string().min(1).max(255),
    country: z.string().max(255).optional(),
    state: z.string().max(255).optional(),
    city: z.string().max(255).optional(),
    isVerified: z.boolean().optional(),
    // no need for createdAt and updatedAt as they are automatically handled by the database
});

// User validation schema
export const userSchema = z.object({
    masjid_id: z.number().int().optional(),
    name: z.string().min(1).max(255),
    email: z.string().min(5, "Email is required").email({message: "this is not a valid email"}).max(255),
    password: z.string().min(8).max(255),
    address: z.string().min(1).max(255),
    country: z.string().max(255).optional(),
    state: z.string().max(255).optional(),
    city: z.string().max(255).optional(),
    isVerified: z.boolean().optional(),
});

// Namaz validation schema
export const namazSchema = z.object({
    user_id: z.number().int(),
    date: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    fajr_namaz: z.string(), // Add proper time validation if needed
    fajr_jamat: z.string(), // Add proper time validation if needed
    zuhr_namaz: z.string(), // Add proper time validation if needed
    zuhr_jamat: z.string(), // Add proper time validation if needed
    asr_namaz: z.string(), // Add proper time validation if needed
    asr_jamat: z.string(), // Add proper time validation if needed
    maghrib_namaz: z.string(), // Add proper time validation if needed
    maghrib_jamat: z.string(), // Add proper time validation if needed
    isha_namaz: z.string(), // Add proper time validation if needed
    isha_jamat: z.string(), // Add proper time validation if needed
});
