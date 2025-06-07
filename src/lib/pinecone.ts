import {Pinecone} from '@pinecone-database/pinecone';
import { downloadFromS3 } from './s3-server';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {Document, RecursiveCharacterTextSplitter} from '@pinecone-database/doc-splitter';

let pinecone : Pinecone | null = null ;
export const getPineconeClient = async () => {
    if(!pinecone){
        pinecone = new Pinecone({
            apiKey : process.env.PINECONE_API_KEY as string
        });
        return pinecone;

    }
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
    const documents = await Promise.all(pages.map(page=>prepareDocument(page)));
    return pages;
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
