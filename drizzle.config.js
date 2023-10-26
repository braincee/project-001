import * as dotenv from 'dotenv'

dotenv.config({
  path: '.env.local',
})

export default {
  schema: './libs/drizzle/schema.js',
  out: './libs/drizzle/schema-out.js',
  dbCredentials: {
    connectionString: process.env.NEXT_POSTGRESQL_URI,
  },
  driver: 'pg',
}
