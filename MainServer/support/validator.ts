import openAPIValidator from 'openapi-validator-middleware';
import express from 'express';
import path from 'path';
export class Validator {



  /**
  * The method init. Initialize the validator
  *
  * @returns void
  */
  public static init(): void {
    // openAPIValidator.init(path.join(__dirname, '..', '..', 'static', 'openapi3.json'));
  }

  /**
  * The method preValidate. 
  *
  * @returns void
  */
  private static preValidate(): void {
  }

  /**
  * The method validate. 
  *
  * @param req of type express.Request
  * @param res of type express.Response
  * @param next of type express.NextFunction
  * @returns void
  */
  public static validate(req: express.Request, res: express.Response, next: express.NextFunction): void {
    // Validator.preValidate();

    // openAPIValidator.validate(req, res, next);
    next();
  }

}


// Validator.init();