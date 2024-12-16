import {defineConfig} from 'drizzle-kit'

const DATABASE_URL = "postgresql://jordybrian225:A7fNE0WmIvKy@ep-bold-water-69219359.us-east-2.aws.neon.tech/chatpdf-db?sslmode=require";

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/db/schema.ts",
    out: './drizzle',
    dbCredentials: {
        url: DATABASE_URL!
    }
})

//npx drizzle-kit push:pg