import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required')
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  avatar_url: z.string().url().or(z.literal('')).optional(),
  password: z.string().min(6).optional()
});

export const createChatSchema = z.object({
  title: z.string().min(1, 'Title is required').default('Multimodal Workspace Chat'),
  file_ids: z.array(z.string()).optional().default([]),
  category: z.enum(['Education', 'Healthcare', 'Legal', 'Research', 'Business', 'Personal']).optional().default('Personal')
});

export const sendMessageSchema = z.object({
  chat_id: z.string().min(1, 'Chat ID is required'),
  content: z.string().min(1, 'Message content cannot be empty'),
  file_ids: z.array(z.string()).optional().default([])
});

export const generateReportSchema = z.object({
  file_ids: z.array(z.string()).min(1, 'At least one file ID is required for AI report generation'),
  title: z.string().optional(),
  user_prompt: z.string().optional(),
  category: z.enum(['Education', 'Healthcare', 'Legal', 'Research', 'Business', 'Personal']).optional().default('Personal')
});

export const searchQuerySchema = z.object({
  query: z.string().min(1, 'Search query cannot be empty'),
  category: z.string().optional(),
  mime_type: z.string().optional()
});
