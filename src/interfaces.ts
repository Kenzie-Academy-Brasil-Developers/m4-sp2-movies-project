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

export interface IMoviePages {
    previousPage: string;
    nextPage: string;
    count: number;
    data: IMovie[];
}

export type MovieResult = QueryResult<IMovie>;