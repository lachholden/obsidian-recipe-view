export const NUMBER = new RegExp(/\d+(\/\d+)?/)
export const UNIT = new RegExp(/tb?sp?s?\.?|tablespoons?|teaspoons?|k?g|(kilo)?grams?|cups?|m?Ls?|millilit(re|er)s?|lit(re|er)s?|(fl.?|fluid)?\s+(oz\.?|ounces?)|pounds?|lbs?\.?|sticks?/i)

export const QUANTITY_WITH_UNIT = new RegExp("(?<number>" + NUMBER.source + ")\\s+(?<unit>" + UNIT.source + ")\\b", "ig");
export const START_NUMBER_ALONE = new RegExp("(?<startnumber>^" + NUMBER.source + ")\\b", "ig");
export const QUANTITY = new RegExp(QUANTITY_WITH_UNIT.source + "|" + START_NUMBER_ALONE.source, "ig");