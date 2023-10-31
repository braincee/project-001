import postgres from 'postgres'
import * as schema from './schema'
import { drizzle } from 'drizzle-orm/postgres-js'
import { env } from '@/env.mjs'

const connectionString = env.POSTGRESQL_URI
const client = postgres(connectionString)

export const db = drizzle(client, { schema: { ...schema } })
