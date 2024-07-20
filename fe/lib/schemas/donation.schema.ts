import { z } from "zod";

export const DonationSchema = z.object({
  amount: z.coerce.number(),
});

export type DonationSchema = z.infer<typeof DonationSchema>;
