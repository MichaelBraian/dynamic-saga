"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDatabaseConnection = testDatabaseConnection;
exports.testTableAccess = testTableAccess;
var pg_1 = require("pg");
var dotenv_1 = require("dotenv");
// Load environment variables
dotenv_1.default.config();
// Create a connection pool
var pool = new pg_1.Pool({
    host: (_a = process.env.SUPABASE_DB_HOST) === null || _a === void 0 ? void 0 : _a.replace('https://', ''),
    port: parseInt(process.env.SUPABASE_DB_PORT || '5432'),
    database: process.env.SUPABASE_DB_NAME,
    user: process.env.SUPABASE_DB_USER,
    password: process.env.SUPABASE_DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false // Required for Supabase
    }
});
function testDatabaseConnection() {
    return __awaiter(this, void 0, void 0, function () {
        var client, result, tables, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, 5, 7]);
                    return [4 /*yield*/, pool.connect()];
                case 1:
                    client = _a.sent();
                    console.log('Successfully connected to the database');
                    return [4 /*yield*/, client.query('SELECT NOW()')];
                case 2:
                    result = _a.sent();
                    console.log('Database time:', result.rows[0].now);
                    return [4 /*yield*/, client.query("\n      SELECT table_name \n      FROM information_schema.tables \n      WHERE table_schema = 'public'\n    ")];
                case 3:
                    tables = _a.sent();
                    console.log('\nAvailable tables:');
                    tables.rows.forEach(function (row) { return console.log('-', row.table_name); });
                    // Release the client
                    client.release();
                    return [2 /*return*/, {
                            success: true,
                            timestamp: result.rows[0].now,
                            tables: tables.rows.map(function (row) { return row.table_name; })
                        }];
                case 4:
                    error_1 = _a.sent();
                    console.error('Database connection error:', error_1);
                    return [2 /*return*/, {
                            success: false,
                            error: error_1 instanceof Error ? error_1.message : 'Unknown error'
                        }];
                case 5: 
                // End the pool
                return [4 /*yield*/, pool.end()];
                case 6:
                    // End the pool
                    _a.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Create a function to test specific tables
function testTableAccess() {
    return __awaiter(this, void 0, void 0, function () {
        var client, races, classes, attributes, equipment, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pool.connect()];
                case 1:
                    client = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 7, 8, 10]);
                    return [4 /*yield*/, client.query('SELECT COUNT(*) FROM races')];
                case 3:
                    races = _a.sent();
                    console.log('\nRaces count:', races.rows[0].count);
                    return [4 /*yield*/, client.query('SELECT COUNT(*) FROM character_classes')];
                case 4:
                    classes = _a.sent();
                    console.log('Character classes count:', classes.rows[0].count);
                    return [4 /*yield*/, client.query('SELECT COUNT(*) FROM character_attributes')];
                case 5:
                    attributes = _a.sent();
                    console.log('Character attributes count:', attributes.rows[0].count);
                    return [4 /*yield*/, client.query('SELECT COUNT(*) FROM equipment_items')];
                case 6:
                    equipment = _a.sent();
                    console.log('Equipment items count:', equipment.rows[0].count);
                    return [2 /*return*/, {
                            success: true,
                            counts: {
                                races: parseInt(races.rows[0].count),
                                classes: parseInt(classes.rows[0].count),
                                attributes: parseInt(attributes.rows[0].count),
                                equipment: parseInt(equipment.rows[0].count)
                            }
                        }];
                case 7:
                    error_2 = _a.sent();
                    console.error('Table access error:', error_2);
                    return [2 /*return*/, {
                            success: false,
                            error: error_2 instanceof Error ? error_2.message : 'Unknown error'
                        }];
                case 8:
                    client.release();
                    return [4 /*yield*/, pool.end()];
                case 9:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    });
}
