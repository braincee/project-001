import postgres from 'postgres'
import * as schema from './schema'
import { drizzle } from 'drizzle-orm/postgres-js'

const connectionString = process.env.NEXT_POSTGRESQL_URI
const client = postgres(connectionString)

export const db = drizzle(client, { schema: { ...schema } })
