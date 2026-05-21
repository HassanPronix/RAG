import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { OpenAIEmbeddings } from "@langchain/openai";

import { Chroma } from "@langchain/community/vectorstores/chroma";

import { Document } from "@langchain/core/documents";

export async function ingestDocument(text, fileName) {

    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 700, chunkOverlap: 100, });

    const chunks = await splitter.splitDocuments([new Document({
        pageContent: text,
        metadata: {
            source: fileName,
        },
    }),]);

    const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small", });

    await Chroma.fromDocuments(chunks, embeddings, {
        collectionName: "rag-docs",
        url: "http://localhost:8081",
    }
    );

    return chunks.length;
}