"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentStore = exports.Document = void 0;
class Document {
    constructor(_text) {
        this.text = _text;
    }
}
exports.Document = Document;
class DocumentStore {
    constructor() {
        this.documents = new Map();
    }
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
    AddDocument(path, document) {
        this.documents.set(path, document);
    }
    SearchDocuments(path) {
        console.log(this.documents);
        let response = new Array();
        this.documents.forEach((value, key, map) => {
            if (value.text.includes(path))
                response.push(value);
        });
        return response;
    }
    PeekDocument(path) {
        return this.documents.has(path);
    }
    DeleteDocument(path) {
        if (this.documents.has(path))
            this.documents.delete(path);
    }
}
exports.DocumentStore = DocumentStore;
