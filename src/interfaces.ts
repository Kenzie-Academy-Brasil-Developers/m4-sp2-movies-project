import { QueryResult } from 'pg';

export interface IMoviesRequest {
    name: string;
    description: string;
    duration: number;
    price: number;
}

export interface IMovie extends IMoviesRequest {
    id: number;
}

export type MovieResult = QueryResult<IMovie>;