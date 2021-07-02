/**
 * @param {number} degrees 
 * @returns {number} angle in radians.
 */
const degreeToRadians = (degrees: number): number => {
    return degrees * Math.PI / 180;
};

/**
 * @param {number} radians 
 * @returns {number} angle in degrees.
 */
const radiansToDegree = (radians: number): number => {
    return radians * 180 / Math.PI;
};

/**
 * Interpolate between v1 and v2 by t.
 * @param {number} v1 value from.
 * @param {number} v2 value to.
 * @param {number} t in range [0, 1].
 * @returns {number} interpolated result between the two numeric values.
 */
const lerp = (v1: number, v2: number, t: number): number => {
    return v1 + (v2 - v1) * t;
};
/**
 * Min distance interpolate between v1 and v2 by t.
 * @param {number} v1 value from.
 * @param {number} v2 value to.
 * @param {number} t in range [0, 1].
 * @param {number} range [range=360] range to wrap around.
 * @returns {number} interpolated result between two values.
 */
const lerpAngle = (v1: number, v2: number, t: number, range: number = 360): number => {
    let result: number;
    const dt = v2 - v1;
    const mid = range * 0.5;
    if (dt < -mid) {
        v2 += range;
        result = lerp(v1, v2, t);
        if (result >= range) {
            result -= range;
        }
    } else if (dt > mid) {
        v2 -= range;
        result = lerp(v1, v2, t);
        if (result < 0) {
            result += range;
        }
    } else {
        result = lerp(v1, v2, t);
    }
    return result;
};

/**
 * Interpolate between two Points by t.
 * @typedef {Object} Point - {x:number, y:number}.
 * @param {Point} p1 Point from.
 * @param {Point} p2 Point to.
 * @param {number} t in range [0, 1].
 * @param {Point} target will update target values instead of returning new Object.
 * @returns {Point | void} will return new Point or will update target with interpolated result.
*/
const lerpPoint = (p0: Point, p1: Point, t: number, target?: Point): Point | undefined => {
    const x = lerp(p0.x, p1.x, t);
    const y = lerp(p0.y, p1.y, t);
    if (target) {
        target.x = x;
        target.y = y;
    } else {
        return { x, y };
    }
};

/**
 * Curve interpolate by t.
 * @typedef {Object} Point - {x:number, y:number}.
 * @param {Point} p1 start point.
 * @param {Point} cp1 first control point.
 * @param {Point} cp2 second control point.
 * @param {Point} p1 end point.
 * @param {number} t in range [0, 1].
 * @param {Point} target will update target values instead of returning new Object.
 * @returns {Point | void} will return new Point or will update target with interpolated result.
*/
const lerpCurve = (p1: Point, cp1: Point, cp2: Point, p2: Point, t: number, target?: Point): Point => {
    const t2 = t * t;
    const t3 = t * t * t;
    const x = Math.pow(1 - t, 3) * p1.x + 3 * Math.pow(1 - t, 2) * t * cp1.x + 3 * (1 - t) * t2 * cp2.x + t3 * p2.x;
    const y = Math.pow(1 - t, 3) * p1.y + 3 * Math.pow(1 - t, 2) * t * cp1.y + 3 * (1 - t) * t2 * cp2.y + t3 * p2.y;
    if (target) {
        target.x = x;
        target.y = y;
    } else {
        return { x, y };
    }
};

/**
 * @typedef {Object} Point - {x:number, y:number}.
 * @param {number} t in range [0, 1].
 * @param {Point} p1 start point.
 * @param {Point} cp1 first control point.
 * @param {Point} cp2 second control point.
 * @param {Point} p1 end point.
 * @returns {number} angle in radians.
*/
const lerpCurveAngle = (p1: Point, cp1: Point, cp2: Point, p2: Point, t: number): number => {
    const t2 = t * t;
    const dx = 3 * Math.pow(1 - t, 2) * (cp1.x - p1.x) + 6 * (1 - t) * t * (cp2.x - cp1.x) + 3 * t2 * (p2.x - cp2.x);
    const dy = 3 * Math.pow(1 - t, 2) * (cp1.y - p1.y) + 6 * (1 - t) * t * (cp2.y - cp1.y) + 3 * t2 * (p2.y - cp2.y);
    return Math.atan2(dx, dy);
};

/**
 * Returns angle in radians between p1 and p2.
 * @typedef {Object} Point - {x:number, y:number}.
 * @param {Point} p1 Point from.
 * @param {Point} p2 Point to.
 * @returns {number} angle in radians.
*/
const angleBetweenTwoPoints = (p1: Point, p2: Point): number => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.atan2(dx, dy);
};

/**
 * Returns distance between p1 and p2.
 * @typedef {Object} Point - {x:number, y:number}.
 * @param {Point} p1 Point from.
 * @param {Point} p2 Point to.
 * @returns {number} length.
*/
const distanceBetweenTwoPoints = (p1: Point, p2: Point): number => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Returns intersection point between two lines.
 * @typedef {Object} Point - {x:number, y:number}.
 * @param {Point} p1 line1 from.
 * @param {Point} p2 line1 to.
 * @param {Point} p1 line2 from.
 * @param {Point} p2 line2 to.
 * @param {boolean} extrapolate will return position outside ranges.
 * @param {Point} target will update target values instead of returning new Object.
 * @returns {Point | void} will return new Point or will update target.
*/
const linesIntersection = (p1: Point, p2: Point, p3: Point, p4: Point, extrapolate: boolean = false, target?: Point): Point | null => {
    if (target) {
        target.x = NaN;
        target.y = NaN;
    }

    const d1x = p2.x - p1.x;
    const d1y = p2.y - p1.y;
    const d2x = p4.x - p3.x;
    const d2y = p4.y - p3.y;
    const denom = d1x * d2y - d2x * d1y;

    if (denom == 0) {
        return;
    }

    const a = p1.y - p3.y;
    const b = p1.x - p3.x;
    const a1 = (d2x * a - d2y * b) / denom;
    const b1 = (d1x * a - d1y * b) / denom;

    const inRange = extrapolate ? true : (a1 > 0 && a1 < 1 && b1 > 0 && b1 < 1);
    if (inRange) {
        if (target) {
            target.x = p1.x + d1x * a1;
            target.y = p1.y + d1y * a1;
        } else {
            return { x: p1.x + d1x * a1, y: p1.y + d1y * a1 };
        }
    }
};

/**
 * Returns triangle face.
 * 
 * @typedef {Object} Point - {x:number, y:number}.
 * @param {Point} p1 triangle point 1.
 * @param {Point} p2 triangle point 2.
 * @param {Point} p3 triangle point 3. 
 * @returns {number} will return 1 if triangle points are clockwise and -1 if counterclockwise. 
*/
const triangleFace = (p1: Point, p2: Point, p3: Point): number => {
    const ax = p3.x - p1.x;
    const ay = p3.y - p1.y;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.min(1, Math.max((ax * dy - ay * dx), -1));
};

/**
 * Shift Point
 * 
 * @typedef {Object} Point - {x:number, y:number}.
 * @param {Point} p target.
 * @param {Point} vec direction.
 * @param {number} mag magnitude.
*/
const shiftPoint = (p: Point, vec: Point, mag: number): void => {
    p.x = p.x + vec.x * mag;
    p.y = p.y + vec.y * mag;
};

/**
 * Rotate Point around center
 * 
 * @typedef {Object} Point - {x:number, y:number}.
 * @param {Point} p target.
 * @param {Point} center center.
 * @param {number} angle angle in radians.
 * @returns {Point | undefined} will return unit vector.
*/
const rotatePointAround = (p: Point, center: Point, angle: number): void => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const x = p.x - center.x;
    const y = p.y - center.y;

    p.x = x * cos - y * sin + center.x;
    p.y = x * sin + y * cos + center.y;
};

/**
 * Clamps number within bounds.
 * @param {number} min lower bound.
 * @param {number} max upper bound.
 * @param {number} value number to clamp.
 * @returns {number} returns the clamped number.
*/
const clamp = (min: number, max: number, value: number): number => {
    min = min || value;
    return (max !== undefined) ? Math.min(max, Math.max(min, value)) : Math.max(min, value);
};
