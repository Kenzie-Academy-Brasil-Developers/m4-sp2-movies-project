import { Request, Response } from 'express';
import { client } from './database';
import { IMovie, IMoviesRequest, MovieResult } from './interfaces';
import format = require('pg-format');

export const createMovie = async (req: Request, res: Response): Promise<Response> => {
    const requestedData: IMoviesRequest = req.body;

    const queryString: string = format(`
        INSERT INTO
            movies_table(%I)
        VALUES
            (%L)
        RETURNING *;
    `,
        Object.keys(requestedData),
        Object.values(requestedData)
    );

    const queryResult: MovieResult = await client.query(queryString);
    const newIncludedMovie: IMovie = queryResult.rows[0];

    return res.status(201).json(newIncludedMovie);
};

export const listMovies = async (req: Request, res: Response): Promise<Response> => {
    const queryString: string = `
        SELECT
            *
        FROM
            movies_table
    `;

    const queryResult: MovieResult = await client.query(queryString);

    return res.status(200).json(queryResult.rows);
};