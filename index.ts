import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { DocumentStore, Document } from './src/models/document';
import StatusCodes from 'http-status-codes'
import bodyParser from 'body-parser';

dotenv.config();
const cors=require('cors')
const app = express();
app.use(cors({
  origin:"*"
}))


const port = process.env.PORT;
var jsonParser = bodyParser.json()


app.post('/document', jsonParser, (req: Request, res: Response) => {
  console.log(req.body)
  try {
    const { path, document }: {
      path: string,
      document: Document
    } = req.body;
    if (!path || !document?.text) {
      let isPathMising = path == undefined;
      let isDocumentMissing = document?.text == undefined;
      let message = `Attributes ( ${isPathMising ? "path | " : "" + isDocumentMissing ? "document" : ""})`;
      return res.status(StatusCodes.BAD_REQUEST).json({
        message
      });
    }

    if (DocumentStore.Instance.PeekDocument(path)) {
      return res.status(StatusCodes.CONFLICT).json({
        message: 'Document with this path already exists'
      });
    }

    DocumentStore.Instance.AddDocument(path, document);
    res.status(StatusCodes.OK).send({
      message: "Document added successfully"
    })
  } catch (e: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: {
        error: e.message
      }
    });
  }
});

app.get('/document', (req: Request, res: Response) => {
  try {
    const { path }: any = req.query;
    if (!path) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'path is missing'
      });
    }
    
    let documents = DocumentStore.Instance.SearchDocuments(path);
    
    res.status(StatusCodes.OK).json({
      data: documents
    })
  } catch (e: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: {
        error: e.message
      }
    });
  }
})

app.delete('/document', (req: Request, res: Response) => {
  try {
    const { path }: any = req.query;
    if (!path) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'path is missing'
      });
    }
  
    const check=DocumentStore.Instance.PeekDocument(path)
    if(check === true)
    {
      DocumentStore.Instance.DeleteDocument(path);
      res.status(StatusCodes.OK).json({
        message: 'Document deleted successfully'
      });

    }
    if(check === false)
    {

      res.status(StatusCodes.BAD_GATEWAY).json({
        message: 'Invalid Document Name'
      });

    }
    
  } catch (e: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: {
        error: e.message
      }
    });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});