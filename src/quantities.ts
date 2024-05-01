/** Matches numbers of the forms e.g. 1, 1.5, 1/2, 3 1/2 */
import Fraction from "fraction.js";

export const NUMBER = new RegExp(/\d+(([\s-]+\d+)?\/\d+|\.\d+)?/)

/** Matches a whole bunch of common units that you would want to scale in recipes */
export const UNIT = new RegExp(/tb?sp?s?\.?|tablespoons?|teaspoons?|k?g|(kilo)?grams?|cups?|m?Ls?|millilit(re|er)s?|lit(re|er)s?|(fl.?|fluid)?\s+(oz\.?|ounces?)|pounds?|lbs?\.?|sticks?/i)

/** Matches a number followed by some whitespace and a unit */
export const NUMBER_WITH_UNIT = new RegExp("(?<number>" + NUMBER.source + ")\\s*(?<unit>" + UNIT.source + ")\\b", "ig");

/** Matches a number at the start of a string by itself */
export const START_NUMBER_ALONE = new RegExp("(?<startnumber>^" + NUMBER.source + ")\\b", "ig");

/** Matches either a number at the start of a string, or otherwise a number and unit */
export const QUANTITY = new RegExp(NUMBER_WITH_UNIT.source + "|" + START_NUMBER_ALONE.source, "ig");

export enum QtyFormatType {
    FRACTION,
    DECIMAL,
}

/**
 * Replace text fractions in a normalised unicode string with unicode equivalents, built
 * from super- and sub-script characters + \u2044.
 * @param str NFKD-normalised unicode string
 * @returns The same string with text fractions replaced by unicode equivalents
 */
export function reUnicodeFractions(str: string) {
    return str.replace(/\b(?<n>\d+)\/(?<d>\d+)\b/ig, (m, $1, $2) => {
        return $1
            .replace("0", "\u2070")
            .replace("1", "\u00B9")
            .replace("2", "\u00B2")
            .replace("3", "\u00B3")
            .replace("4", "\u2074")
            .replace("5", "\u2075")
            .replace("6", "\u2076")
            .replace("7", "\u2077")
            .replace("8", "\u2078")
            .replace("9", "\u2079") + "\u2044" + $2
                .replace("0", "\u2080")
                .replace("1", "\u2081")
                .replace("2", "\u2082")
                .replace("3", "\u2083")
                .replace("4", "\u2084")
                .replace("5", "\u2085")
                .replace("6", "\u2086")
                .replace("7", "\u2087")
                .replace("8", "\u2088")
                .replace("9", "\u2089")
    });
}

function numberStringToQuantityNumber(str: string, unit?: string) {
    return {
        value: new Fraction(str.replace(/[-\s]+/g, " ")),
        format: (str.contains("/") ||
            unit?.match(/tablespoons?|teaspoons?|tb?sp?s?\.?|cups?|sticks?/i) ||
            !unit)
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

export function formatQuantity(value: Fraction, format: QtyFormatType, scale: Fraction, unicodeFractions: boolean) {
    value = value.mul(scale);
    if (format == QtyFormatType.FRACTION) {
        value = value.d == 3 ? value : new Fraction(Math.round(16 * new Fraction(value).valueOf()), 16);
        return unicodeFractions ? reUnicodeFractions(value.toFraction(true)) : value.toFraction(true);
    } else {
        return value.toString();
    }
}