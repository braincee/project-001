import * as dotenv from 'dotenv'

dotenv.config({
  path: '.env.local',
})

export default {
  schema: './db/schema.ts',
  out: './db/schema-out.ts',
  dbCredentials: {
    connectionString: process.env.POSTGRESQL_URI,
  },
  driver: 'pg',
}
