import { getEmbeddings } from "./embeddings";
import { getPineconeClient } from "./pinecone";
import { convertToAscii } from "./utils";

export async function getMatchesForEmbedding(embeddings: number[], file_key: string) {
    // Going to take vectors of the query and pull out similar vectors from pinecone for the query. 
    const pineconeClient = await getPineconeClient();
    const pineconeIndex = await pineconeClient.Index('pdfgptee');
    try {
        const namespace = convertToAscii(file_key);
        const queryResult = await pineconeIndex.namespace(namespace).query({
            topK: 5,
            vector: embeddings,
            includeMetadata: true,
        });
        return queryResult?.matches; // will return top 5 vectors.
    } catch (error) {
        console.error("Error : ", error);
        throw error;
    }

}

export async function getContext(query: string, file_key: string) {
    const queryEmbeddings = await getEmbeddings(query) as number[];
    const matches = await getMatchesForEmbedding(queryEmbeddings, file_key);
    // const qualifyingDocs = matches.filter(match => match.score && match.score > 0.5);
    type metadata = {
        text: string,
        pageNumber: number
    }
    let docs = matches.map(match => (match.metadata as metadata).text);
    return docs.join('\n');
}