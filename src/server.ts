import cors from "@fastify/cors";
import Fastify from "fastify";
import { planRoutes } from "./routes/plan";

const defaultAllowedOrigins = [
  "http://localhost:3000",
  "https://app-dietas.rogerfer.dev",
];

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  : defaultAllowedOrigins;

const app = Fastify({
  logger: true,
});

await app.register(cors, {
  methods: ["GET", "POST", "OPTIONS"],
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true);
      return;
    }

    cb(new Error("Origin not allowed"), false);
  },
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.register(planRoutes);

app
  .listen({ port: Number(process.env.PORT) || 3333, host: "0.0.0.0" })
  .then(() => {
    console.log(
      `Server is running on port ${Number(process.env.PORT) || 3333}`
    );
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
