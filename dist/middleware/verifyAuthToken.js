"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifyAuthToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];
        jsonwebtoken_1.default.decode(token, { complete: true });
        if (!token) {
            return res.status(401).json({ error: 'Null token.' });
        }
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
            if (error) {
                return res.status(403).json({ error: error.message });
            }
            req.body.user = user;
            next();
        });
    }
    catch (error) {
        return res.status(401).json(`Access denied, invalid token: ${error}`);
    }
};
exports.default = verifyAuthToken;
