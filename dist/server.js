"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const product_1 = __importDefault(require("./handlers/product"));
const user_1 = __importDefault(require("./handlers/user"));
const order_1 = __importDefault(require("./handlers/order"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const address = '0.0.0.0:3000';
const corsOptions = { credential: true, origin: process.env.URL || '*' };
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.get('/api', (req, res) => {
    res.send('API of a Storefront Backend');
});
(0, product_1.default)(app);
(0, user_1.default)(app);
(0, order_1.default)(app);
app.listen(3000, () => {
    console.log(`Running app on ${address}`);
});
exports.default = app;
