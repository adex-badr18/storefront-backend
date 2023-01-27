"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function jwtTokens({ id, firstName, lastName, username }) {
    const user = { id, firstName, lastName, username };
    const accessToken = jsonwebtoken_1.default.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
    return { accessToken };
}
exports.jwtTokens = jwtTokens;
