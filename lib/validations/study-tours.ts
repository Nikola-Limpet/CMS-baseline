import { z } from 'zod';

// Study Tour Status enum validation
export const studyTourStatusSchema = z.enum([
  'draft',
  'open',
  'closed',
  'cancelled',
  'completed'
]);

// Registration Strategy enum validation  
export const registrationStrategySchema = z.enum([
  'internal',
  'google_form',
  'telegram'
]);

// Study Tour Registration Status enum validation
export const studyTourRegistrationStatusSchema = z.enum([
  'pending',
  'confirmed',
  'cancelled',
  'waitlist'
]);

// Base Study Tour schema without refinements
const baseStudyTourSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string().optional(),
  location: z.string()
    .min(3, 'Location must be at least 3 characters')
    .max(100, 'Location must be less than 100 characters'),
  startDate: z.date({
    required_error: 'Start date is required',
    invalid_type_error: 'Start date must be a valid date'
  }),
  endDate: z.date({
    required_error: 'End date is required',
    invalid_type_error: 'End date must be a valid date'
  }),
  registrationDeadline: z.date({
    required_error: 'Registration deadline is required',
    invalid_type_error: 'Registration deadline must be a valid date'
  }),
  duration: z.string()
    .max(50, 'Duration must be less than 50 characters')
    .optional(),
  capacity: z.number()
    .int('Capacity must be a whole number')
    .min(1, 'Capacity must be at least 1')
    .optional(),
  image: z.string()
    .url('Image must be a valid URL')
    .max(500, 'Image URL must be less than 500 characters')
    .optional(),
  registrationStrategy: registrationStrategySchema,
  googleFormUrl: z.string()
    .max(500, 'Google Form URL must be less than 500 characters')
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: 'Google Form URL must be valid'
    }),
  telegramAdminContact: z.string()
    .max(100, 'Telegram admin contact must be less than 100 characters')
    .optional(),
  registrationInstructions: z.string().optional(),
  price: z.number()
    .min(0, 'Price cannot be negative'),
  status: studyTourStatusSchema,
  organizer: z.string()
    .max(100, 'Organizer name must be less than 100 characters')
    .optional(),
});

// Create Study Tour schema with refinements
export const createStudyTourSchema = baseStudyTourSchema.refine(data => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate']
}).refine(data => data.registrationDeadline < data.startDate, {
  message: 'Registration deadline must be before start date',
  path: ['registrationDeadline']
}).refine(data => {
  // Validate registration strategy specific fields
  if (data.registrationStrategy === 'google_form' && !data.googleFormUrl) {
    return false;
  }
  if (data.registrationStrategy === 'telegram' && !data.telegramAdminContact) {
    return false;
  }
  return true;
}, {
  message: 'Required fields missing for selected registration strategy',
  path: ['registrationStrategy']
});

// Update Study Tour schema (partial base schema + id)
export const updateStudyTourSchema = baseStudyTourSchema.partial().extend({
  id: z.string().uuid('Invalid study tour ID')
});

// Study Tour Registration schema
export const createStudyTourRegistrationSchema = z.object({
  studyTourId: z.string().uuid('Invalid study tour ID'),
  participantName: z.string()
    .min(2, 'Participant name must be at least 2 characters')
    .max(100, 'Participant name must be less than 100 characters'),
  participantEmail: z.string()
    .email('Invalid email address')
    .max(100, 'Email must be less than 100 characters'),
  participantPhone: z.string()
    .min(8, 'Phone number must be at least 8 characters')
    .max(20, 'Phone number must be less than 20 characters')
    .optional(),
  emergencyContactName: z.string()
    .max(100, 'Emergency contact name must be less than 100 characters')
    .optional(),
  emergencyContactPhone: z.string()
    .min(8, 'Emergency contact phone must be at least 8 characters')
    .max(20, 'Emergency contact phone must be less than 20 characters')
    .optional(),
  dietaryRequirements: z.string().optional(),
  specialNeeds: z.string().optional(),
  notes: z.string().optional(),
});

// Update Study Tour Registration schema
export const updateStudyTourRegistrationSchema = z.object({
  id: z.string().uuid('Invalid registration ID'),
  status: studyTourRegistrationStatusSchema.optional(),
  participantName: z.string()
    .min(2, 'Participant name must be at least 2 characters')
    .max(100, 'Participant name must be less than 100 characters')
    .optional(),
  participantEmail: z.string()
    .email('Invalid email address')
    .max(100, 'Email must be less than 100 characters')
    .optional(),
  participantPhone: z.string()
    .min(8, 'Phone number must be at least 8 characters')
    .max(20, 'Phone number must be less than 20 characters')
    .optional(),
  emergencyContactName: z.string()
    .max(100, 'Emergency contact name must be less than 100 characters')
    .optional(),
  emergencyContactPhone: z.string()
    .min(8, 'Emergency contact phone must be at least 8 characters')
    .max(20, 'Emergency contact phone must be less than 20 characters')
    .optional(),
  dietaryRequirements: z.string().optional(),
  specialNeeds: z.string().optional(),
  notes: z.string().optional(),
});

// Query schemas for filtering and searching
export const studyTourQuerySchema = z.object({
  search: z.string().optional(),
  status: studyTourStatusSchema.optional(),
  location: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  registrationStrategy: registrationStrategySchema.optional(),
  hasCapacity: z.boolean().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
  sortBy: z.enum(['title', 'startDate', 'registrationDeadline', 'createdAt']).default('startDate'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export const studyTourRegistrationQuerySchema = z.object({
  studyTourId: z.string().uuid().optional(),
  status: studyTourRegistrationStatusSchema.optional(),
  search: z.string().optional(), // Search by participant name or email
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
  sortBy: z.enum(['participantName', 'registeredAt', 'status']).default('registeredAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Type exports
export type CreateStudyTourData = z.infer<typeof createStudyTourSchema>;
export type UpdateStudyTourData = z.infer<typeof updateStudyTourSchema>;
export type CreateStudyTourRegistrationData = z.infer<typeof createStudyTourRegistrationSchema>;
export type UpdateStudyTourRegistrationData = z.infer<typeof updateStudyTourRegistrationSchema>;
export type StudyTourQueryData = z.infer<typeof studyTourQuerySchema>;
export type StudyTourRegistrationQueryData = z.infer<typeof studyTourRegistrationQuerySchema>;
export type StudyTourStatus = z.infer<typeof studyTourStatusSchema>;
export type RegistrationStrategy = z.infer<typeof registrationStrategySchema>;
export type StudyTourRegistrationStatus = z.infer<typeof studyTourRegistrationStatusSchema>; 