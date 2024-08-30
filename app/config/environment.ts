import { type } from "arktype";
import { makeTypedEnvironment } from "~/lib";

// Define the public environment schema.
const publicEnvSchema = type({});
// Extend the public schema to create the full environment schema.
const envSchema = type(publicEnvSchema, "&", {
  NODE_ENV: ["'development'|'production'|'test'", "=", "development"],
  SUPABASE_URL: "string>0",
  SUPABASE_KEY: "string>0",
});

// Create the environment parsers for public and full schemas.
const getPublicEnv = makeTypedEnvironment((d) =>
  publicEnvSchema.onUndeclaredKey("delete").assert(d)
);

const getEnv = makeTypedEnvironment((d) => envSchema.assert(d));

export { getEnv, getPublicEnv };
