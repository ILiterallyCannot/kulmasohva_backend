import {
  Router as ExpressRouter,
  Request,
  Response,
  NextFunction,
} from "express";

import * as qs from 'qs';

declare global {
  namespace Express {
    interface ParamsDictionary {
      [key: string]: string;
    }

    interface Req<
      P extends ParamsDictionary = ParamsDictionary,
      ResBody = any,
      ReqBody = any,
      ReqQuery = qs.ParsedQs
    > extends Request<P, ResBody, ReqBody, ReqQuery> {}

    interface Res extends Response {}
    interface Next extends NextFunction {}
    type ExpressRouter = {};
  }
}

export {};
