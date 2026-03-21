import { z } from 'zod';

const requiredField = 'Заполните это поле.';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, requiredField)
    .email('Введите корректный email.'),
  password: z
    .string()
    .min(1, requiredField)
    .min(8, 'Пароль должен содержать минимум 8 символов.'),
});

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, 'Укажите имя.'),
    lastName: z.string().trim().min(1, 'Укажите фамилию.'),
    middleName: z.string().trim().optional(),
    email: z
      .string()
      .trim()
      .min(1, requiredField)
      .email('Введите корректный email.'),
    phone: z
      .string()
      .trim()
      .min(1, 'Укажите телефон.')
      .regex(/^[\d\s()+-]{10,20}$/, 'Введите корректный телефон.'),
    department: z.string().trim().min(1, 'Укажите подразделение.'),
    position: z.string().trim().min(1, 'Укажите должность.'),
    password: z
      .string()
      .min(1, requiredField)
      .min(8, 'Пароль должен содержать минимум 8 символов.'),
    confirmPassword: z.string().min(1, 'Повторите пароль.'),
  })
  .refine((values: { password: string; confirmPassword: string }) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Пароли должны совпадать.',
  });

export const registrationRequestSchema = z.object({
  firstName: z.string().trim().min(1, 'Укажите имя.'),
  lastName: z.string().trim().min(1, 'Укажите фамилию.'),
  middleName: z.string().trim().optional(),
  email: z
    .string()
    .trim()
    .min(1, requiredField)
    .email('Введите корректный email.'),
  phone: z
    .string()
    .trim()
    .min(1, 'Укажите телефон.')
    .regex(/^[\d\s()+-]{10,20}$/, 'Введите корректный телефон.'),
  department: z.string().trim().min(1, 'Укажите подразделение.'),
  position: z.string().trim().min(1, 'Укажите должность.'),
  note: z.string().trim().optional(),
}).refine((values: { note?: string }) => (values.note ?? '').length <= 240, {
  path: ['note'],
  message: 'Не более 240 символов.',
});

export const supportRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, requiredField)
    .email('Введите корректный email.'),
  topic: z.string().trim().min(1, 'Выберите тему.'),
  message: z.string().trim().min(8, 'Опишите обращение подробнее.'),
}).refine((values: { message: string }) => values.message.length <= 400, {
  path: ['message'],
  message: 'Не более 400 символов.',
});

export const adminOnboardingSchema = z.object({
  firstName: z.string().trim().min(1, 'Укажите имя.'),
  lastName: z.string().trim().min(1, 'Укажите фамилию.'),
  middleName: z.string().trim().optional(),
  email: z
    .string()
    .trim()
    .min(1, requiredField)
    .email('Введите корректный email.'),
  phone: z
    .string()
    .trim()
    .min(1, 'Укажите телефон.')
    .regex(/^[\d\s()+-]{10,20}$/, 'Введите корректный телефон.'),
  department: z.string().trim().min(1, 'Укажите подразделение.'),
  position: z.string().trim().min(1, 'Укажите должность.'),
  note: z.string().trim().optional(),
  facilityName: z.string().trim().min(1, 'Укажите площадку доступа.'),
  accessLevel: z.string().trim().min(1, 'Укажите уровень доступа.'),
  requestId: z.string().trim().optional(),
}).refine((values: { note?: string }) => (values.note ?? '').length <= 240, {
  path: ['note'],
  message: 'Не более 240 символов.',
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type RegistrationRequestFormValues = z.infer<typeof registrationRequestSchema>;
export type SupportRequestFormValues = z.infer<typeof supportRequestSchema>;
export type AdminOnboardingFormValues = z.infer<typeof adminOnboardingSchema>;
