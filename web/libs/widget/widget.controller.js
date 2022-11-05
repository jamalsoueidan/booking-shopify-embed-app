"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Booking = __importStar(require("../../database/models/booking"));
var Product = __importStar(require("../../database/models/product"));
var Schedule = __importStar(require("../../database/models/schedule"));
var widget_helper_1 = __importDefault(require("./widget.helper"));
var staff = function (_a) {
    var query = _a.query;
    return __awaiter(void 0, void 0, void 0, function () {
        var productId, shop, staff;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    productId = query.productId, shop = query.shop;
                    return [4 /*yield*/, Product.getAllStaff({ shop: shop, productId: productId })];
                case 1:
                    staff = _b.sent();
                    if (staff.length === 0) {
                        throw "no staff or product exist";
                    }
                    return [2 /*return*/, staff];
            }
        });
    });
};
var availabilityDay = function (_a) {
    var query = _a.query;
    return __awaiter(void 0, void 0, void 0, function () {
        var staffId, date, productId, shop, product, schedules, bookings, scheduleDates;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    staffId = query.staffId, date = query.date, productId = query.productId, shop = query.shop;
                    return [4 /*yield*/, Product.getProductWithSelectedStaffId({
                            shop: shop,
                            productId: productId,
                            staffId: staffId,
                        })];
                case 1:
                    product = _b.sent();
                    if (!product) {
                        throw "no staff or product";
                    }
                    return [4 /*yield*/, Schedule.getByStaffAndTag({
                            tag: product.staff.tag,
                            staff: product.staff.staff,
                            start: date,
                            end: date,
                        })];
                case 2:
                    schedules = _b.sent();
                    return [4 /*yield*/, Booking.getBookingsByProductAndStaff({
                            shop: shop,
                            productId: productId,
                            start: date,
                            end: date,
                            staffId: product.staff.staff,
                        })];
                case 3:
                    bookings = _b.sent();
                    scheduleDates = schedules.reduce(widget_helper_1.default.scheduleReduce(product), []);
                    bookings.forEach(function (book) {
                        return (scheduleDates = scheduleDates.map(widget_helper_1.default.scheduleCalculateBooking(book)));
                    });
                    return [2 /*return*/, scheduleDates];
            }
        });
    });
};
var availabilityRangeByStaff = function (_a) {
    var query = _a.query;
    return __awaiter(void 0, void 0, void 0, function () {
        var staffId, start, end, shop, productId, product, schedules, bookings, scheduleDates;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    staffId = query.staffId, start = query.start, end = query.end, shop = query.shop, productId = query.productId;
                    return [4 /*yield*/, Product.getProductWithSelectedStaffId({
                            shop: shop,
                            productId: productId,
                            staffId: staffId,
                        })];
                case 1:
                    product = _b.sent();
                    if (!product) {
                        throw "no staff or product";
                    }
                    return [4 /*yield*/, Schedule.getByStaffAndTag({
                            tag: product.staff.tag,
                            staff: product.staff.staff,
                            start: start,
                            end: end,
                        })];
                case 2:
                    schedules = _b.sent();
                    return [4 /*yield*/, Booking.getBookingsByProductAndStaff({
                            shop: shop,
                            productId: productId,
                            staffId: staffId,
                            start: start,
                            end: end,
                        })];
                case 3:
                    bookings = _b.sent();
                    scheduleDates = schedules.reduce(widget_helper_1.default.scheduleReduce(product), []);
                    bookings.forEach(function (book) {
                        return (scheduleDates = scheduleDates.map(widget_helper_1.default.scheduleCalculateBooking(book)));
                    });
                    return [2 /*return*/, scheduleDates];
            }
        });
    });
};
var availabilityRangeByAll = function (_a) {
    var query = _a.query;
    return __awaiter(void 0, void 0, void 0, function () {
        var start, end, shop, productId, product, schedules, bookings, scheduleDates;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    start = query.start, end = query.end, shop = query.shop, productId = query.productId;
                    return [4 /*yield*/, Product.findOne({
                            shop: shop,
                            productId: "gid://shopify/Product/" + productId,
                            active: true,
                        })];
                case 1:
                    product = _b.sent();
                    return [4 /*yield*/, Schedule.getByTag({
                            tag: product.staff.map(function (s) { return s.tag; }),
                            start: start,
                            end: end,
                        })];
                case 2:
                    schedules = _b.sent();
                    return [4 /*yield*/, Booking.getBookingsByProduct({
                            shop: shop,
                            productId: productId,
                            start: start,
                            end: end,
                        })];
                case 3:
                    bookings = _b.sent();
                    scheduleDates = schedules.reduce(widget_helper_1.default.scheduleReduce(product), []);
                    bookings.forEach(function (book) {
                        return (scheduleDates = scheduleDates.map(widget_helper_1.default.scheduleCalculateBooking(book)));
                    });
                    return [2 /*return*/, scheduleDates];
            }
        });
    });
};
exports.default = {
    staff: staff,
    availabilityDay: availabilityDay,
    availabilityRangeByAll: availabilityRangeByAll,
    availabilityRangeByStaff: availabilityRangeByStaff,
};
