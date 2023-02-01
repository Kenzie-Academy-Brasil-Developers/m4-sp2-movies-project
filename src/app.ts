import { Application } from 'express';
import { startDatabase } from './database';
import { createMovie } from './functions';
import express = require('express');

const app: Application = express();
app.use(express.json());

app.post('/movies', createMovie);

app.listen('3000', async () => {
    await startDatabase();
    console.log('Server is running on http://localhost:3000/ 🚀');
});