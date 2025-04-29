// validation/site-settings-schema.ts
import * as z from "zod";

export const siteSettingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  label: z.string().optional(),
  type: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  paymentInfo: z.string().optional(),
  supportInfo: z.string().optional(),
  currency: z.string().optional(),
  tariff: z.object({
    energyRate: z.object({
        value: z.string().optional(),
        unit: z.string().optional(),
    }),
    waterRate: z.object({
        value: z.string().optional(),
        unit: z.string().optional(),
    }),
  }),
});
