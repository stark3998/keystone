import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import http from 'http';
import path from 'path';

import { InputValidationError } from 'openapi-validator-middleware';
import { configuration } from './support/appConfig';

import { exampleCntrl } from './controller/ExampleCntrl';
import { floorplanCntrl } from './controller/FloorplanCntrl';
import { escapeRouteCntrl } from './controller/escapeRoutreCntrl';




export class Server {

  private apiApp: express.Express;
  private port: number;


  /**
  * The method constructor. Constructor
  *
  */
  public constructor() {
    this.apiApp = express();
    this.port = configuration.webport;
    this.apiApp.disable('x-powered-by');
    this.apiApp.disable('etag');
  }

  /**
  * The method start. 
  *
  * @returns Promise<void>
  */
  public async start(): Promise<void> {
    const server: http.Server = this.apiApp.listen(this.port, () => {
      console.log(`------------API Web Server Starting on port ${this.port} -------------`);
    });
  }

  /**
  * The method setMiddleware. 
  *
  * @returns void
  */
  public setMiddleware(): void {
    this.apiApp.use(helmet());
    this.apiApp.use(express.static('static'));
    this.apiApp.use(cors({
      origin: ['http://localhost:4200', 'http://127.0.0.1:4200', 'http://localhost:4400', 'http://localhost:3000'],
      credentials: true
    }));
    this.apiApp.use(cookieParser());
    this.apiApp.use(express.json());

    this.apiApp.use(express.urlencoded({ 'extended': true }));
    // this.apiApp.use(express.static(path.join(__dirname, '..', 'static')));
  }

  /**
  * The method setRouterMiddleWare. 
  *
  * @returns void
  */
  public setRouterMiddleWare(): void {
    this.apiApp.use('/v1/example', exampleCntrl.router);
    this.apiApp.use('/v1/floorplan', floorplanCntrl.router);
    this.apiApp.use('/v1', escapeRouteCntrl.router);
    this.apiApp.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (err instanceof InputValidationError) {
        return res.status(400).json({ more_info: JSON.stringify(err.errors) });
      } 
    });
  }

}


const api: Server = new Server();
api.setMiddleware();
api.setRouterMiddleWare();
api.start();
