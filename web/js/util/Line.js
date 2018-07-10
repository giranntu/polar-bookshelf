
const {Preconditions} = require("../Preconditions");

/**
 * Simple line with just a start and end.
 */
class Line {

    /**
     *
     * @param start {number}
     * @param end {number}
     * @param [axis] {string} Optional axis parameter ('x' or 'y')
     */
    constructor(start, end, axis) {
        this.start = Preconditions.assertNumber(start, "start");
        this.end = Preconditions.assertNumber(end, "end");
        this.axis = axis; // TODO validate
    }

    /**
     * The width of the line. Not to be confused with the width of a rect.
     *
     * @Deprecated The dimension of a line is length. Not width. Use length()
     * instead.
     * @return {number}
     */
    get width() {
        return this.end - this.start;
    }

    get length() {
        return this.end - this.start;
    }

    /**
     * Return true if the given point is between the start and end position
     * of the line (inclusive)
     *
     * @param pt {number}
     * @return {boolean}
     */
    containsPoint(pt) {
        return this.within(pt);
    }

    /**
     * Return true if the point is within the start and end points of this line.
     *
     * @param pt {number}
     */
    within(pt) {
        return this.start <= pt && pt <= this.end;
    }

    /**
     * Return true if the given line overlaps the current line.  IE either the start
     * or end point on the given line is between the start and end points of the
     * current line.
     *
     * @param line {Line}
     * @return {boolean}
     */
    overlaps(line) {
        Preconditions.assertNotNull(line, "line");

        //console.log("DEBUG: %s vs %s", this.toString("interval"), line.toString("interval"));

        return this.containsPoint(line.start) || this.containsPoint(line.end);
    }

    /**
     *
     * @param [fmt] optional format parameter. May be 'interval' for interval notation.
     * @return {string}
     */
    toString(fmt) {

        if(fmt === "interval") {
            return `[${this.start},${this.end}]`;
        }

        return `{start: ${this.start}, end: ${this.end}}`;

    }

    /**
     *
     * @param start {number}
     * @param pt {number}
     * @param end {number}
     * @return {boolean}
     */
    static interval(start, pt, end) {
        return start <= pt && pt <= end;
    }

}

module.exports.Line = Line;
