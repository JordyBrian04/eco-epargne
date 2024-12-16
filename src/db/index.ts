import {neon, neonConfig} from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

// neonConfig.fetchConnectionCache = true

const Database = "postgresql://jordybrian225:A7fNE0WmIvKy@ep-bold-water-69219359.us-east-2.aws.neon.tech/chatpdf-db?sslmode=require";

if(!Database)
{
    throw new Error('URL de la bd inconnu')
}

const sql = neon(Database)

export const db = drizzle(sql)