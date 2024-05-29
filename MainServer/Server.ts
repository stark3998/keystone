import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import http from 'http';
import { InputValidationError } from 'openapi-validator-middleware';

import { configuration } from './support/appConfig';
import { exampleCntrl } from './controller/ExampleCntrl';
import { floorplanCntrl } from './controller/FloorplanCntrl';
import { escapeRouteCntrl } from './controller/EscapeRouteCntrl';
// import { locationProcessorCntrl } from './controller/LocationProcessorCntrl';
import { userCntrl } from './controller/UserCntrl';
import { emailServiceCntrl } from './controller/EmailServiceCntrl';

import { Server as WebSocketServer } from 'ws';
import { TriggerCntrl } from './controller/TriggerCntrl';
import { TelegramService } from './utilities/telegramService';
import { LocationProcessorCntrl } from './controller/LocationProcessorCntrl';

import events from 'events';

/**
 * Class representing the server.
 */
export class Server {

  private apiApp: express.Express;
  private port: number;

  public static wss1: WebSocketServer;
  public static wss2: WebSocketServer;

  /**
   * Constructor for the Server class.
   */
  public constructor() {
    this.apiApp = express();
    this.port = configuration.webport;
    this.apiApp.disable('x-powered-by');
    this.apiApp.disable('etag');
    events.EventEmitter.defaultMaxListeners = 10;
  }

  /**
   * Start the server.
   * @returns Promise<void>
   */
  public async start(): Promise<void> {
    const server: http.Server = this.apiApp.listen(this.port, () => {
      console.log(`------------API Web Server Starting on port ${this.port} -------------`);
    });
    Server.wss1 = new WebSocketServer({ noServer: true });
    Server.wss2 = new WebSocketServer({ noServer: true });

    server.on('upgrade', (request, socket, head) => {
      const pathname = request.url;
    
      if (pathname === '/ws1') {
        Server.wss1.handleUpgrade(request, socket, head, (ws) => {
          Server.wss1.emit('connection', ws, request);
        });
      } else if (pathname === '/ws2') {
        Server.wss2.handleUpgrade(request, socket, head, (ws) => {
          Server.wss2.emit('connection', ws, request);
        });
      } else {
        socket.destroy();
      }
    });
  }

  /**
   * Set up middleware for the server.
   * @returns void
   */
  public setMiddleware(): void {
    this.apiApp.use(helmet());
    this.apiApp.use(express.static('static'));
    this.apiApp.use(cors({
      origin: ['http://localhost:4200', 'http://127.0.0.1:4200', 'http://localhost:4400', 'http://localhost:3000', 'http://localhost:5001'],
      credentials: true
    }));
    this.apiApp.use(cookieParser());
    this.apiApp.use(express.json({ limit: '500mb' }));
    this.apiApp.use(express.urlencoded({ 'extended': true }));
    // this.apiApp.use(express.static(path.join(__dirname, '..', 'static')));
  }

  /**
   * Set up router middleware for the server.
   * @returns void
   */
  public setRouterMiddleWare(

  ): void {

    var triggerCntrl = new TriggerCntrl(Server.wss1);
    var locationProcessorCntrl = new LocationProcessorCntrl(Server.wss2);

    this.apiApp.use('/v1/example', exampleCntrl.router);
    this.apiApp.use('/v1/floorplan', floorplanCntrl.router);
    this.apiApp.use('/v1/userlocation', locationProcessorCntrl.router);
    this.apiApp.use('/v1/users', userCntrl.router);
    this.apiApp.use('/v1/email', emailServiceCntrl.router);
    this.apiApp.use('/v1/trigger', triggerCntrl.router);
    this.apiApp.use('/v1', escapeRouteCntrl.router);
    this.apiApp.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (err instanceof InputValidationError) {
        return res.status(400).json({ more_info: JSON.stringify(err.errors) });
      } 
    });
  }
}

// Create an instance of the Server class
const api: Server = new Server();

// Set up middleware
api.setMiddleware();

// Start the server
api.start();

// Set up router middleware
api.setRouterMiddleWare();

TelegramService.telegramBot(Server.wss1);
