import postgres from 'postgres'
import * as schema from './schema'
import { drizzle } from 'drizzle-orm/postgres-js'

const connectionString = process.env.POSTGRESQL_URI as string
const client = postgres(connectionString)

export const db = drizzle(client, { schema: { ...schema } })
