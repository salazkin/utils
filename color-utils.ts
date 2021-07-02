/**
 * Convert number hex color value to HSL.
 * @param {number} hex color value.
 * @returns {[number, number, number]} [h, s, l] in range [0, 1].
*/
const hexToHsl = (hex: number): Vec3 => {
    const r = (hex >> 16) / 255;
    const g = (hex >> 8 & 0xff) / 255;
    const b = (hex & 0xff) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let l = (max + min) / 2;
    let s = 0;
    let h = 0;
    if (max !== min) {
        const d = max - min;
        s = l < 0.5 ? d / (max + min) : d / (2 - max - min);
        if (r == max) {
            h = (g - b) / d + (g < b ? 6 : 0);
        } else if (g == max) {
            h = 2 + (b - r) / d;
        } else {
            h = 4 + (r - g) / d;
        }
    }
    h /= 6;
    return [h, s, l];
};

/**
 * Convert number hex color value to RGB.
 * @param {number} hex color value.
 * @returns {[number, number, number]} [r, g, b].
*/
const hexToRgb = (hex: number): Vec3 => {
    return [hex >> 16, hex >> 8 & 0xff, hex & 0xff];
};

/**
 * Convert RGB to hex.
 * @param {number} r red value.
 * @param {number} g green value.
 * @param {number} b blue value.
 * @returns {number} hex color value.
*/
const rgbToHex = (r: number, g: number, b: number): number => {
    return r << 16 | g << 8 | b;
};

/**
 * Convert HSL to hex.
 * @param {number} h hue value.
 * @param {number} s saturation value.
 * @param {number} l lightness (intensity) value.
 * @returns {number} hex color value.
*/
const hslToHex = (h: number, s: number, l: number): number => {
    let r: number, g: number, b: number;
    if (s == 0) {
        r = g = b = l;
    } else {
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        const hue = (t: number, p: number, q: number): number => {
            if (t < 0) { t += 1; }
            if (t > 1) { t -= 1; }
            if (t < 1 / 6) { return p + (q - p) * 6 * t; }
            if (t < 1 / 2) { return q; }
            if (t < 2 / 3) { return p + (q - p) * (2 / 3 - t) * 6; }
            return p;
        };
        r = Math.round(hue(h + 1 / 3, p, q) * 255);
        g = Math.round(hue(h, p, q) * 255);
        b = Math.round(hue(h - 1 / 3, p, q) * 255);
    }
    return rgbToHex(r, g, b);
};
