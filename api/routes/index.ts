import express, { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import colorCodes from './ColorCodes.json';

var router = express.Router();

interface ColorCode {
  number: number | null;
  exponent: number;
  tolerance: number | null;
}

interface ResistorBands {
  exponentBand: string;
  firstBand: string;
  secondBand: string;
  thirdBand?: string;
  toleranceBand?: string;
}

// Add typing to imported json
const ColorCodes: Record<string, ColorCode> = colorCodes;

// Create arrays of valid colors for different bands/
const ValidNumberColors = Object.keys(ColorCodes).filter((key) => ColorCodes[key].number !== null);
const ValidToleranceColors: Array<string | null> = Object.keys(ColorCodes).filter(
  (key) => ColorCodes[key].tolerance !== null
);

/* GET home page. */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json(['respond with a resource']);
});

router.get('/hello', (req: Request, res: Response, next: NextFunction) => {
  const name = req.query.name ?? 'Anonymous';

  res.status(200).set('Content-Type', 'text/html; charset=utf-8').send(`Hello, ${name}`);
});

// POST band colors of a resistors to get the label associated to the bands
router.post(
  '/calculate-value',
  body('firstBand').isIn(ValidNumberColors),
  body('secondBand').isIn(ValidNumberColors),
  body('thirdBand').optional().isIn(ValidNumberColors),
  body('exponentBand').isIn(Object.keys(ColorCodes)),
  body('toleranceBand').optional().exists().isIn(ValidToleranceColors),
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
    const {
      exponentBand,
      firstBand,
      secondBand,
      thirdBand,
      toleranceBand,
    }: ResistorBands = req.body;

    // Get the values associated to the colors of the passed bands
    const { exponent } = ColorCodes[exponentBand];
    const firstSignificantDigit = ColorCodes[firstBand].number ?? 1;
    const secondSignificantDigit = ColorCodes[secondBand].number ?? 0;
    const { number: thirdSignificantDigit }: { number?: number | null } =
      thirdBand === undefined ? {} : ColorCodes[thirdBand];
    const tolerance = toleranceBand === undefined ? 20 : ColorCodes[toleranceBand].tolerance ?? 20;

    // Calculate the resistance according to digits & exponent bands
    let resistance = (firstSignificantDigit * 10 + secondSignificantDigit) * Math.pow(10, exponent);
    // Add third significant digit if defined
    if (thirdSignificantDigit !== undefined && thirdSignificantDigit !== null) {
      resistance = resistance * 10 + thirdSignificantDigit * Math.pow(10, exponent);
    }

    // Return label that corresponds to the bands.
    res
      .status(200)
      .set('Content-Type', 'text/html; charset=utf-8')
      .send(`${resistance} ohms ±${tolerance}%`);
  }
);

// POST band colors of a resistors to get the numeric values associated to the bands
router.post(
  '/calculate-values',
  body('firstBand').isIn(ValidNumberColors),
  body('secondBand').isIn(ValidNumberColors),
  body('thirdBand').optional().isIn(ValidNumberColors),
  body('exponentBand').isIn(Object.keys(ColorCodes)),
  body('toleranceBand').optional().isIn(ValidToleranceColors),
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
    const {
      exponentBand,
      firstBand,
      secondBand,
      thirdBand,
      toleranceBand,
    }: ResistorBands = req.body;

    // Get the values associated to the colors of the passed bands
    const { exponent } = ColorCodes[exponentBand];
    const firstSignificantDigit = ColorCodes[firstBand].number ?? 1;
    const secondSignificantDigit = ColorCodes[secondBand].number ?? 0;
    const { number: thirdSignificantDigit }: { number?: number | null } =
      thirdBand === undefined ? {} : ColorCodes[thirdBand];
    const tolerance = toleranceBand === undefined ? 20 : ColorCodes[toleranceBand].tolerance ?? 20;

    // Calculate the resistance according to digits & exponent bands
    let baseResistance =
      (firstSignificantDigit * 10 + secondSignificantDigit) * Math.pow(10, exponent);
    // Add third significant digit if defined
    if (thirdSignificantDigit !== undefined && thirdSignificantDigit !== null) {
      baseResistance = baseResistance * 10 + thirdSignificantDigit * Math.pow(10, exponent);
    }

    // Calculate the values associatesd to the bands & return them
    const values = {
      baseResistance,
      maxResistance: (baseResistance * (100 + tolerance)) / 100,
      mixResistance: (baseResistance * (100 - tolerance)) / 100,
      tolerance,
    };
    res.status(200).set('Content-Type', 'application/json; charset=utf-8').json(values);
  }
);

export default router;
