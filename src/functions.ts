import { Request, Response } from 'express';

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

const sortMoviesList = (req: Request, res: Response): Array<string> => {
    const requiredSorts = ['price', 'duration'];
    const requiredOrder = ['ASC', 'DESC'];
    const sortValue = req.query.sort?.toString().toLowerCase();
    const orderValue = req.query.order?.toString().toUpperCase() || 'ASC';

    if (requiredSorts.some(str => str === sortValue)) {
        if (requiredOrder.some(str => str === orderValue)) {
            return [sortValue, orderValue];
        }
    }

    return ['id', 'ASC'];
};

export const listMovies = async (req: Request, res: Response): Promise<Response> => {
    const perPage: number = !Number(req.query.perPage) || Number(req.query.perPage) <= 0 || Number(req.query.perPage) > 5 ? 5 : Number(req.query.perPage);
    const page: number = !Number(req.query.page) || Number(req.query.page) <= 0 ? 0 : (Number(req.query.page) - 1) * perPage;
    const currentPage: number = !Number(req.query.page) || Number(req.query.page) <= 0 ? 1 : Number(req.query.page);
    
    const sortResult: Array<string> = [...sortMoviesList(req, res)];

    const queryString: string = format(`
        SELECT
            *
        FROM
            movies_table
        ORDER BY %I %s
        LIMIT %s OFFSET %s;
    `,
        sortResult[0],
        sortResult[1],
        perPage,
        page
    );

    const queryResult: MovieResult = await client.query(queryString);

    const newDataResult: IMoviePages = {
        previousPage: currentPage === 1 ? null : `http://localhost:3000/movies?page=${currentPage - 1}&perPage=${perPage}`,
        nextPage: `http://localhost:3000/movies?page=${currentPage + 1}&perPage=${perPage}`,
        count: queryResult.rowCount,
        data: queryResult.rows
    };

    return res.status(200).json(newDataResult);
};

export const updateMovie = async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).json();
};