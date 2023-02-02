import { Request, Response } from 'express';
import { QueryConfig } from 'pg';

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
    const perPage: any = !Number(req.query.perPage) || Number(req.query.perPage) <= 0 || Number(req.query.perPage) > 5 ? 5 : Number(req.query.perPage);
    const page: any = !Number(req.query.page) || Number(req.query.page) <= 0 ? 0 : (Number(req.query.page) - 1) * perPage;

    const queryString: string = `
        SELECT
            *
        FROM
            movies_table
        LIMIT $1 OFFSET $2;
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [perPage, page]
    };

    const queryResult: MovieResult = await client.query(queryConfig);

    return res.status(200).json(queryResult.rows);
};