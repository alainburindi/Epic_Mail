import {Pool} from 'pg';
import dotenv from 'dotenv'

dotenv.config()


const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'epic_mail',
    password: 'le66lit66',
    port: 5432
})

const query = (text, params, callback) => pool.query(text, params, callback)

export default query;

