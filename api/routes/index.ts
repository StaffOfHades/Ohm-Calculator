import express, { NextFunction, Request, Response } from 'express';

var router = express.Router();

/* GET home page. */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json(['respond with a resource']);
});

export default router;
