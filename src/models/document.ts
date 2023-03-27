export class Document {
    public text: string;

    constructor(_text: string) {
        this.text = _text;
    }
}

export class DocumentStore {

    private static _instance: DocumentStore | undefined;
    private documents: Map<string, Document>;
    private constructor() {
        this.documents = new Map<string, Document>();
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }
    public AddDocument(path: string, document: Document) {
        this.documents.set(path, document);
    }

    public SearchDocuments(path: string): Document[] {
        console.log(this.documents)
        let response: Document[] = new Array<Document>();
        this.documents.forEach((value, key, map) => {
            if (value.text.includes(path))
                response.push(value);
         
        });
        return response;
    }

    public PeekDocument(path: string): boolean {
        return this.documents.has(path);
    }

    public DeleteDocument(path: any) {
        if (this.documents.has(path)) this.documents.delete(path);
    }
}