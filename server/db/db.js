import {Pool} from 'pg';
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
    connectionString : process.env.DATABASE_URL,
    ssl: true
})

const query = (text, params, callback) => pool.query(text, params, callback)

export default query;

