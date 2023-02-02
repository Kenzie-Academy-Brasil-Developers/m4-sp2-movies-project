import { NextFunction, Request, Response } from 'express';
import { QueryConfig, QueryResult } from 'pg';
import { client } from './database';

export const checkMovieName = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const movieName: string = req.body.name;

    const queryString: string = `
        SELECT name
        FROM movies_table
        WHERE name = $1;
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [movieName]
    };

    const queryResult: QueryResult = await client.query(queryConfig);

    if (queryResult.rowCount) {
        return res.status(409).json({ message: 'Movie already exists.' });
    }

    return next();
};