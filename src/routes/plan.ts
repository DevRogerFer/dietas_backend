import { generateDietPlan } from "../agent";
import { DietPlanRequestSchema } from "../types";
import type { FastifyInstance } from "fastify";

export async function planRoutes(app: FastifyInstance) {
  app.post("/plan", async (request, reply) => {
    const parse = DietPlanRequestSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({
        error: "ValidationError",
        details: parse.error.flatten((issue) => issue.message),
      });
    }

    reply.hijack();
    reply.raw.setHeader("Access-Control-Allow-Origin", "*");
    reply.raw.setHeader("Content-Type", "text/event-stream");
    reply.raw.setHeader("Cache-Control", "no-cache");
    reply.raw.setHeader("Connection", "keep-alive");

    try {
      for await (const delta of generateDietPlan(parse.data)) {
        reply.raw.write(delta);
      }
      reply.raw.end();
    } catch (err: any) {
      request.log.error(err);
      reply.raw.write(`event: error\n ${JSON.stringify(err.message)}`);
      reply.raw.end();
    }
  });
}
