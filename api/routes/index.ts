import express, { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import colorCodes from './ColorCodes.json';

var router = express.Router();

interface ColorCode {
  number: number | null;
  exponent: number;
  tolerance: number | null;
}

const ColorCodes: Record<string, ColorCode> = colorCodes;

const ValidNumberColors = Object.keys(ColorCodes).filter((key) => ColorCodes[key].number !== null);
const ValidToleranceColors: Array<string | null> = Object.keys(ColorCodes).filter(
  (key) => ColorCodes[key].tolerance !== null
);
// Add empty (null) tolerance band to valid colors
ValidToleranceColors.push(null);

/* GET home page. */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json(['respond with a resource']);
});

// POST band colors of a resistors to get the label associated to the bands
router.post(
  '/calculate-value',
  body('firstBand').isIn(ValidNumberColors),
  body('secondBand').isIn(ValidNumberColors),
  body('exponentBand').isIn(Object.keys(ColorCodes)),
  body('toleranceBand').exists().isIn(ValidToleranceColors),
  (req: Request, res: Response, next: NextFunction) => {
    // Finds the validation errors in this request
    // and wraps them in an object.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Only retrieve the names of the invalid params & make sure they are distinct.
      let invalidFields = errors.array().map((error) => error.param);
      invalidFields = Array.from(new Set(invalidFields));

      // Return invalid fields
      return res
        .status(400)
        .set('Content-Type', 'application/json; charset=utf-8')
        .json({ invalidFields });
    }
    // If no errors occur, we can safely retrieve & manipulate the bands
    const { exponentBand, firstBand, secondBand, toleranceBand } = req.body;

    // Get the values associated to the colors of the passed bands
    const { exponent } = ColorCodes[exponentBand];
    const firstSignificantDigit = ColorCodes[firstBand].number ?? 1;
    const secondSignificantDigit = ColorCodes[secondBand].number ?? 0;
    const tolerance = toleranceBand === null ? 20 : ColorCodes[toleranceBand].tolerance ?? 20;

    // Calculate the number according to digits & exponent bands
    const number = (firstSignificantDigit * 10 + secondSignificantDigit) * Math.pow(10, exponent);

    // Return label that corresponds to the labels.
    res
      .status(200)
      .set('Content-Type', 'text/html; charset=utf-8')
      .send(`${number} ohms ±${tolerance}%`);
  }
);

export default router;
