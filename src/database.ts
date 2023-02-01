import { Client } from 'pg';

export const client: Client = new Client({
    user: 'httpv',
    password: '1234',
    host: 'localhost',
    database: 'module_4',
    port: 5432
});

export const startDatabase = async (): Promise<void> => {
    await client.connect();
    console.log('Database connected!');
};