import { defineConfig, env } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.developer.ts", // npx prisma db seed
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
