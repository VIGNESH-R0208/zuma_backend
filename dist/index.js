"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const document_1 = require("./src/models/document");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const cors = require('cors');
const app = (0, express_1.default)();
app.use(cors({
    origin: "*"
}));
const port = process.env.PORT;
var jsonParser = body_parser_1.default.json();
app.post('/document', jsonParser, (req, res) => {
    console.log(req.body);
    try {
        const { path, document } = req.body;
        if (!path || !(document === null || document === void 0 ? void 0 : document.text)) {
            let isPathMising = path == undefined;
            let isDocumentMissing = (document === null || document === void 0 ? void 0 : document.text) == undefined;
            let message = `Attributes ( ${isPathMising ? "path | " : "" + isDocumentMissing ? "document" : ""})`;
            return res.status(http_status_codes_1.default.BAD_REQUEST).json({
                message
            });
        }
        if (document_1.DocumentStore.Instance.PeekDocument(path)) {
            return res.status(http_status_codes_1.default.CONFLICT).json({
                message: 'Document with this path already exists'
            });
        }
        document_1.DocumentStore.Instance.AddDocument(path, document);
        res.status(http_status_codes_1.default.OK).send({
            message: "Document added successfully"
        });
    }
    catch (e) {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            message: {
                error: e.message
            }
        });
    }
});
app.get('/document', (req, res) => {
    try {
        const { path } = req.query;
        if (!path) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json({
                message: 'path is missing'
            });
        }
        let documents = document_1.DocumentStore.Instance.SearchDocuments(path);
        res.status(http_status_codes_1.default.OK).json({
            data: documents
        });
    }
    catch (e) {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            message: {
                error: e.message
            }
        });
    }
});
app.delete('/document', (req, res) => {
    try {
        const { path } = req.query;
        if (!path) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json({
                message: 'path is missing'
            });
        }
        const check = document_1.DocumentStore.Instance.PeekDocument(path);
        if (check === true) {
            document_1.DocumentStore.Instance.DeleteDocument(path);
            res.status(http_status_codes_1.default.OK).json({
                message: 'Document deleted successfully'
            });
        }
        if (check === false) {
            res.status(http_status_codes_1.default.BAD_GATEWAY).json({
                message: 'Invalid Document Name'
            });
        }
    }
    catch (e) {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({
            message: {
                error: e.message
            }
        });
    }
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
