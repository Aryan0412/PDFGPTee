import {Pinecone, PineconeRecord} from '@pinecone-database/pinecone';
import { downloadFromS3 } from './s3-server';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {Document, RecursiveCharacterTextSplitter} from '@pinecone-database/doc-splitter';
import { getEmbeddings } from './embeddings';
import md5 from 'md5';
import { convertToAscii } from './utils';


let pinecone : Pinecone | null = null ;
export const getPineconeClient = async () => {
    if(!pinecone){
        let apiKey = process.env.PINECONE_API_KEY as string;
        if(!apiKey){
            throw new Error("Pinecone API key is not set");
        }
        pinecone = new Pinecone({
            apiKey : process.env.PINECONE_API_KEY as string
        });
        return pinecone;
    }
    return pinecone;
}

type PDFPAGE = {
    pageContent : string,
    metadata : {
        loc : {pageNumber : number},
    }
}

export const loadS3IntoPinecode = async (file_key : string) => {
    // 1. Obtain the pdf -> download and read from pdf.
    console.log("Downloading s3 into file system");
    const file_name = await downloadFromS3(file_key);
    if(!file_name){
        throw new Error("Could not download S3");
    }
    const loader = new PDFLoader(file_name!);
    const pages : PDFPAGE[] = (await loader.load()) as PDFPAGE[];

    // 2. Segment pdf pages into smaller paragraph.
    const documents = await Promise.all(pages.map(page=>prepareDocument(page))); // [array of documents converted into small documents]
    const vectors = await Promise.all(documents.flat().map((doc)=>embedDocuments(doc)));

    // Upload to pinecone
    const pineconeClient = await getPineconeClient();
    const pineconeIndex = pineconeClient?.Index('pdfgptee');
    console.log("Inserting embeddings into pinecone");
    const namespace : string = convertToAscii(file_key);
    await pineconeIndex?.namespace(namespace).upsert(vectors);
    return documents[0];
}

async function embedDocuments (doc : Document) {
    try{
        const embeddings = await getEmbeddings(doc.pageContent);
        const hash = md5(doc.pageContent);
        return {
            id : hash,
            values : embeddings,
            metadata : {
                text : doc.metadata.text,
                pageNumber : doc.metadata.pageNumber
            }
        } as PineconeRecord
    }catch(error){
        console.error("Error embedding documents : ", error); 
        throw error;
    }
}



export const truncateStringByBytes = (str : string, bytes : number) => {
    const enc = new TextEncoder();
    return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, bytes));
}

async function prepareDocument(page : PDFPAGE){
    let {pageContent, metadata} = page;
    pageContent = pageContent.replace(/\n/g, '');

    // split the docs 
    const splitter = new RecursiveCharacterTextSplitter();
    const docs = await splitter.splitDocuments([new Document({pageContent, metadata : {
        pageNumber: metadata.loc.pageNumber,
        text : truncateStringByBytes(pageContent, 3600)
    }})])
    return docs;

}
