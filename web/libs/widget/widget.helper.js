"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var date_fns_1 = require("date-fns");
var scheduleReduce = function (product) {
    return function (previous, current) {
        var _a;
        var end = new Date(current.end);
        var duration = product.duration || 60;
        var buffertime = product.buffertime || 0;
        // we push start time everytime
        var start = new Date(current.start);
        var date = (0, date_fns_1.format)(start, "yyyy-MM-dd");
        var hours = ((_a = previous.find(function (p) { return p.date === date; })) === null || _a === void 0 ? void 0 : _a.hours) || [];
        while ((0, date_fns_1.isBefore)(start, end)) {
            hours.push({
                start: start,
                end: (0, date_fns_1.addMinutes)(start, duration),
                staff: current.staff,
            });
            start = (0, date_fns_1.addMinutes)(start, duration + buffertime);
        }
        previous.push({ date: date, hours: hours });
        return previous;
    };
};
var scheduleCalculateBooking = function (book) {
    var start = book.start, end = book.end, staff = book.staff;
    return function (schedule) {
        return __assign(__assign({}, schedule), { hours: schedule.hours.filter(function (hour) {
                if (hour.staff._id.toString() !== staff.toString()) {
                    return true;
                }
                if ((0, date_fns_1.differenceInMinutes)(start, hour.start) <= 0 &&
                    (0, date_fns_1.differenceInMinutes)(end, hour.start) >= 0) {
                    return false;
                }
                if ((0, date_fns_1.differenceInMinutes)(start, hour.end) <= 0 &&
                    (0, date_fns_1.differenceInMinutes)(end, hour.end) >= 0) {
                    return false;
                }
                return true;
            }) });
    };
};
exports.default = { scheduleCalculateBooking: scheduleCalculateBooking, scheduleReduce: scheduleReduce };
