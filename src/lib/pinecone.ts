import {Pinecone} from '@pinecone-database/pinecone';

let pinecone : Pinecone | null = null ;
export const getPineconeClient = async () => {
    if(!pinecone){
        pinecone = new Pinecone({
            apiKey : process.env.PINECONE_API_KEY as string
        });
        return pinecone;

    }
}

export const loadS3IntoPinecode = async (file_key : string) => {
    // 1. Obtain the pdf -> download and read from pdf.
    
}
