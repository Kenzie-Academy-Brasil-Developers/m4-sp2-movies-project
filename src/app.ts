import { Application } from 'express';

import { startDatabase } from './database';
import { createMovie, listMovies, updateMovie } from './functions';
import { checkMovieName } from './middlewares';

import express = require('express');

const app: Application = express();
app.use(express.json());

app.post('/movies', checkMovieName, createMovie);
app.get('/movies', listMovies);
app.patch('/movies/:id', checkMovieName, updateMovie);

app.listen('3000', async () => {
    await startDatabase();
    console.log('Server is running on http://localhost:3000/ 🚀');
});