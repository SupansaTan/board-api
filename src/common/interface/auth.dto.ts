import { Request as HttpRequest } from 'express';
import { IPayLoad } from "./payload.dto";

export type AuthRequest = HttpRequest & { user: IPayLoad };