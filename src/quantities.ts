import Fraction from "fraction.js";

/** Matches numbers of the forms e.g. 1, 1.5, 1/2, 3 1/2, 5-3/4 */
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
            .replaceAll("0", "\u2070")
            .replaceAll("1", "\u00B9")
            .replaceAll("2", "\u00B2")
            .replaceAll("3", "\u00B3")
            .replaceAll("4", "\u2074")
            .replaceAll("5", "\u2075")
            .replaceAll("6", "\u2076")
            .replaceAll("7", "\u2077")
            .replaceAll("8", "\u2078")
            .replaceAll("9", "\u2079") + "\u2044" + $2
                .replaceAll("0", "\u2080")
                .replaceAll("1", "\u2081")
                .replaceAll("2", "\u2082")
                .replaceAll("3", "\u2083")
                .replaceAll("4", "\u2084")
                .replaceAll("5", "\u2085")
                .replaceAll("6", "\u2086")
                .replaceAll("7", "\u2087")
                .replaceAll("8", "\u2088")
                .replaceAll("9", "\u2089")
    });
}

/**
 * Take a string of one of the forms matched by the NUMBER regex and an optional unit,
 * and return an object with the Fraction value of the number and whether, when scaled,
 * it should be represented as a fraction or decimal.
 * 
 * The preferred format will match the input. If the input is an integer, then
 * tablespoons/teaspoons/cups/sticks will be fractions, and all other units (or no unit
 * specified) will be decimals.
 */
function quantityStringsToValue(str: string, unit?: string) {
    return {
        value: new Fraction(str.replace(/[-\s]+/g, " ")),
        format: (str.includes("/") ||
            unit?.match(/tablespoons?|teaspoons?|tb?sp?s?\.?|cups?|sticks?/i) ||
            (!unit && !str.includes(".")))
            ? QtyFormatType.FRACTION : QtyFormatType.DECIMAL,
    }
}

/**
 * Match all of the quantities present in a string, and return an array of objects
 * describing them.
 * 
 * Requires unicode fractions to have already been normalised to ASCII, which involves
 * NFKD normalisation + replacing \u2044 with a slash.
 */
export function matchQuantities(str: string) {
    return Array.from(str.matchAll(QUANTITY)).map((match) => {
        return {
            index: match.index,
            length: match[0].length,
            value: quantityStringsToValue(match.groups!.number || match.groups!.startnumber, match.groups!.unit),
            unit: match.groups!.unit || null,
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