import { defineConfig } from "drizzle-kit";
 
export default defineConfig({
  schema: "./configs/schema.js",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://ai-formbuilder_owner:7doFu1XJDcgm@ep-plain-sea-a52c62ex.us-east-2.aws.neon.tech/ai-formbuilder?sslmode=require'
  }
});