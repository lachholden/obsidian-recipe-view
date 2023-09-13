/** Matches numbers of the forms e.g. 1, 1.5, 1/2, 3 1/2 */
import Fraction from "fraction.js";

export const NUMBER = new RegExp(/\d+((\s+\d+)?\/\d+|\.\d+)?/)

/** Matches a whole bunch of common units that you would want to scale in recipes */
export const UNIT = new RegExp(/tb?sp?s?\.?|tablespoons?|teaspoons?|k?g|(kilo)?grams?|cups?|m?Ls?|millilit(re|er)s?|lit(re|er)s?|(fl.?|fluid)?\s+(oz\.?|ounces?)|pounds?|lbs?\.?|sticks?/i)

/** Matches a number followed by some whitespace and a unit */
export const NUMBER_WITH_UNIT = new RegExp("(?<number>" + NUMBER.source + ")\\s+(?<unit>" + UNIT.source + ")\\b", "ig");

/** Matches a number at the start of a string by itself */
export const START_NUMBER_ALONE = new RegExp("(?<startnumber>^" + NUMBER.source + ")\\b", "ig");

/** Matches either a number at the start of a string, or otherwise a number and unit */
export const QUANTITY = new RegExp(NUMBER_WITH_UNIT.source + "|" + START_NUMBER_ALONE.source, "ig");

export enum QtyFormatType {
    FRACTION,
    DECIMAL,
}

function numberStringToQuantityNumber(str: string, unit?: string) {
    return {
        value: new Fraction(str),
        format: (str.contains("/") ||
            unit?.match(/tablespoons?|teaspoons?|tb?sp?s?\.?|cups?|sticks?/i))
            ? QtyFormatType.FRACTION : QtyFormatType.DECIMAL,
    }
}

export function matchQuantities(str: string) {
    return Array.from(str.matchAll(QUANTITY)).map((match) => {
        return {
            index: match.index,
            length: match[0].length,
            value: numberStringToQuantityNumber(match.groups!.number || match.groups!.startnumber, match.groups!.unit),
            unit: match.groups!.unit,
        }
    });
}

export function formatQuantity(value: Fraction, format: QtyFormatType, scale: Fraction) {
    value = value.mul(scale);
    if (format == QtyFormatType.FRACTION) {
        value = new Fraction(Math.round(16 * Fraction(value).valueOf()), 16);
        return value.toFraction(true);
    } else {
        return value.toString();
    }
}