import { describe, expect, test } from '@jest/globals';
import Fraction from "fraction.js";
import { reUnicodeFractions, matchQuantities, QtyFormatType, formatQuantity } from './quantities'

describe('re-unicoding fractions', () => {
    test('converts a lone fraction', () => {
        expect(reUnicodeFractions("1/2")).toBe("\u00B9\u2044\u2082");
    });
    test('converts a fraction in text', () => {
        expect(reUnicodeFractions("one half 1/2")).toBe("one half \u00B9\u2044\u2082");
    });
    test('converts two fractions in text', () => {
        expect(reUnicodeFractions("2/3 fractions 1/2")).toBe("\u00B2\u2044\u2083 fractions \u00B9\u2044\u2082");
    });
    test('converts multi-digit fractions in text', () => {
        expect(reUnicodeFractions("them: 3/100 us: 99/100"))
            .toBe("them: \u00B3\u2044\u2081\u2080\u2080 us: \u2079\u2079\u2044\u2081\u2080\u2080");
    });
    test('converts mixed numbers in text', () => {
        expect(reUnicodeFractions("them: 23 3/100"))
            .toBe("them: 23 \u00B3\u2044\u2081\u2080\u2080");
    });
});

describe('matching single quantities in strings', () => {
    test('matches a decimal number', () => {
        expect(matchQuantities("2.67"))
            .toStrictEqual([{
                index: 0,
                length: 4,
                value: { value: new Fraction(267, 100), format: QtyFormatType.DECIMAL },
                unit: null,
            }]);
    });
    test('matches a fraction', () => {
        expect(matchQuantities("3/4"))
            .toStrictEqual([{
                index: 0,
                length: 3,
                value: { value: new Fraction(3, 4), format: QtyFormatType.FRACTION },
                unit: null,
            }]);
    });
    test('matches integer with unit', () => {
        expect(matchQuantities("xxx 200g"))
            .toStrictEqual([{
                index: 4,
                length: 4,
                value: { value: new Fraction(200, 1), format: QtyFormatType.DECIMAL },
                unit: "g",
            }]);
    });
    test('unit at start is retained', () => {
        expect(matchQuantities("200g of flour"))
            .toStrictEqual([{
                index: 0,
                length: 4,
                value: { value: new Fraction(200, 1), format: QtyFormatType.DECIMAL },
                unit: "g",
            }]);
    });
    test('matches integer at start', () => {
        expect(matchQuantities("12 eggs"))
            .toStrictEqual([{
                index: 0,
                length: 2,
                value: { value: new Fraction(12, 1), format: QtyFormatType.FRACTION },
                unit: null,
            }]);
    });
    test('matches ASCII fraction with unit', () => {
        expect(matchQuantities("xxx 1/2 cup"))
            .toStrictEqual([{
                index: 4,
                length: 7,
                value: { value: new Fraction(1, 2), format: QtyFormatType.FRACTION },
                unit: "cup",
            }]);
    });
    test('matches ASCII fraction at start', () => {
        expect(matchQuantities("3/16 sprig"))
            .toStrictEqual([{
                index: 0,
                length: 4,
                value: { value: new Fraction(3, 16), format: QtyFormatType.FRACTION },
                unit: null,
            }]);
    });
    test('matches normalised Unicode fraction with unit', () => {
        expect(matchQuantities("xxx \u00BD lb".normalize("NFKD").replace("\u2044", "/")))
            .toStrictEqual([{
                index: 4,
                length: 6,
                value: { value: new Fraction(1, 2), format: QtyFormatType.FRACTION },
                unit: "lb",
            }]);
    });
    test('matches normalised Unicode fraction at start', () => {
        expect(matchQuantities("\u2075\u2044\u2086 bunch".normalize("NFKD").replace("\u2044", "/")))
            .toStrictEqual([{
                index: 0,
                length: 3,
                value: { value: new Fraction(5, 6), format: QtyFormatType.FRACTION },
                unit: null,
            }]);
    });
    test('matches decimal with unit', () => {
        expect(matchQuantities("xxx 3.5L"))
            .toStrictEqual([{
                index: 4,
                length: 4,
                value: { value: new Fraction(35, 10), format: QtyFormatType.DECIMAL },
                unit: "L",
            }]);
    });
    test('matches decimal at start', () => {
        expect(matchQuantities("1.92 something"))
            .toStrictEqual([{
                index: 0,
                length: 4,
                value: { value: new Fraction(192, 100), format: QtyFormatType.DECIMAL },
                unit: null,
            }]);
    });
    test('matches mixed ASCII number with space with unit', () => {
        expect(matchQuantities("xxx 2 3/4 tablespoons"))
            .toStrictEqual([{
                index: 4,
                length: 17,
                value: { value: new Fraction(11, 4), format: QtyFormatType.FRACTION },
                unit: "tablespoons",
            }]);
    });
    test('matches mixed ASCII number with space at start', () => {
        expect(matchQuantities("10 3/8 unitless"))
            .toStrictEqual([{
                index: 0,
                length: 6,
                value: { value: new Fraction(83, 8), format: QtyFormatType.FRACTION },
                unit: null,
            }]);
    });
    test('matches mixed ASCII number with dash with unit', () => {
        expect(matchQuantities("xxx 2-3/4 tablespoons"))
            .toStrictEqual([{
                index: 4,
                length: 17,
                value: { value: new Fraction(11, 4), format: QtyFormatType.FRACTION },
                unit: "tablespoons",
            }]);
    });
    test('matches mixed ASCII number with dash at start', () => {
        expect(matchQuantities("10-3/8 unitless"))
            .toStrictEqual([{
                index: 0,
                length: 6,
                value: { value: new Fraction(83, 8), format: QtyFormatType.FRACTION },
                unit: null,
            }]);
    });
    test('matches mixed Unicode number with space with unit', () => {
        expect(matchQuantities("xxx 2 \u00BE tablespoons".normalize("NFKD").replace("\u2044", "/")))
            .toStrictEqual([{
                index: 4,
                length: 17,
                value: { value: new Fraction(11, 4), format: QtyFormatType.FRACTION },
                unit: "tablespoons",
            }]);
    });
    test('matches mixed Unicode number with space at start', () => {
        expect(matchQuantities("10 \u215C unitless".normalize("NFKD").replace("\u2044", "/")))
            .toStrictEqual([{
                index: 0,
                length: 6,
                value: { value: new Fraction(83, 8), format: QtyFormatType.FRACTION },
                unit: null,
            }]);
    });
    test('matches mixed Unicode number with dash with unit', () => {
        expect(matchQuantities("xxx 2-\u00BE tablespoons".normalize("NFKD").replace("\u2044", "/")))
            .toStrictEqual([{
                index: 4,
                length: 17,
                value: { value: new Fraction(11, 4), format: QtyFormatType.FRACTION },
                unit: "tablespoons",
            }]);
    });
    test('matches mixed Unicode number with dash at start', () => {
        expect(matchQuantities("10-\u215C unitless".normalize("NFKD").replace("\u2044", "/")))
            .toStrictEqual([{
                index: 0,
                length: 6,
                value: { value: new Fraction(83, 8), format: QtyFormatType.FRACTION },
                unit: null,
            }]);
    });
});

describe('matching multiple quantities in strings', () => {
    test('decimal and fraction together', () => {
        // https://github.com/lachholden/obsidian-recipe-view/issues/20
        expect(matchQuantities("1.5 g (¼ tsp) vanilla paste".normalize("NFKD").replace("\u2044", "/")))
            .toStrictEqual([
                {
                    index: 0,
                    length: 5,
                    value: { value: new Fraction(3, 2), format: QtyFormatType.DECIMAL },
                    unit: "g"
                },
                {
                    index: 7,
                    length: 7,
                    value: { value: new Fraction(1, 4), format: QtyFormatType.FRACTION },
                    unit: "tsp"
                }
            ]);
    });
});

describe('formatting scaled quantities', () => {
    test('decimal to decimal', () => {
        expect(
            formatQuantity(new Fraction("0.25"), QtyFormatType.DECIMAL, new Fraction("3.0"), false)
        ).toBe(
            "0.75"
        );
    });
    test('int to decimal', () => {
        expect(
            formatQuantity(new Fraction("2"), QtyFormatType.DECIMAL, new Fraction("1.25"), false)
        ).toBe(
            "2.5"
        );
    });
    test('fraction to fraction exact', () => {
        expect(
            formatQuantity(new Fraction("1/3"), QtyFormatType.FRACTION, new Fraction("2"), false)
        ).toBe(
            "2/3"
        );
    });
    test('fraction to fraction nearest 1/16', () => {
        expect(
            formatQuantity(new Fraction("1/7"), QtyFormatType.FRACTION, new Fraction("2"), false)
        ).toBe(
            "5/16"
        );
    });
    test('fraction to fraction not rounding thirds', () => {
        expect(
            formatQuantity(new Fraction("1/6"), QtyFormatType.FRACTION, new Fraction("4"), false)
        ).toBe(
            "2/3"
        );
    });
    test('int to fraction', () => {
        expect(
            formatQuantity(new Fraction("3"), QtyFormatType.FRACTION, new Fraction("0.25"), false)
        ).toBe(
            "3/4"
        );
    });
});