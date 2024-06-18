import { Router as ExpressRouter, Request, Response, NextFunction } from "express";

declare module "express" {
    export interface ParamsDictionary {
        [key: string]: string;
      }
      
      export interface Req<
        P extends ParamsDictionary = ParamsDictionary,
        ResBody = any,
        ReqBody = any,
        ReqQuery = qs.ParsedQs
      > extends Request<P, ResBody, ReqBody, ReqQuery> {}
      
      export interface Res extends Response {}
      export interface Next extends NextFunction {}
      export type ExpressRouter = {}
    }
