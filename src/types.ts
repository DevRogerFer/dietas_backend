import { z } from "zod";

export const planRequestSchema = z.object({
    name: z.string().min(2),
    age: z.number().positive(),
    height_cm: z.number().positive(),
    weight_kg: z.number().positive(),
    sex: z.enum(["masculino", "feminino"]),
    activity_level: z.enum(["sedentario", "2x_semana", "4x_semana"]),
    objective: z.enum(["perder_peso", "hipertrofia", "manter_massa"]),
});

export type DietPlanRequest = z.infer<typeof planRequestSchema>;