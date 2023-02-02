import { Request, Response } from 'express';
import { QueryConfig } from 'pg';

import { client } from './database';
import { IMovie, IMoviePages, IMoviesRequest, MovieResult } from './interfaces';

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
    const perPage: number = !Number(req.query.perPage) || Number(req.query.perPage) <= 0 || Number(req.query.perPage) > 5 ? 5 : Number(req.query.perPage);
    const page: number = !Number(req.query.page) || Number(req.query.page) <= 0 ? 0 : (Number(req.query.page) - 1) * perPage;
    const currentPage: number = !Number(req.query.page) || Number(req.query.page) <= 0 ? 1 : Number(req.query.page);

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
    const newDataResult: IMoviePages = {
        previousPage: currentPage === 1 ? null : `http://localhost:3000/movies?page=${currentPage - 1}&perPage=${perPage}`,
        nextPage: `http://localhost:3000/movies?page=${currentPage + 1}&perPage=${perPage}`,
        count: queryResult.rowCount,
        data: queryResult.rows
    };

    return res.status(200).json(newDataResult);
};