import * as dotenv from 'dotenv'
import { env } from './env.mjs'

dotenv.config({
  path: '.env.local',
})

export default {
  schema: './db/schema.ts',
  out: './db/schema-out.ts',
  dbCredentials: {
    connectionString: env.POSTGRESQL_URI,
  },
  driver: 'pg',
}
