import { OpenAIEmbeddings } from "@langchain/openai";

import { Chroma } from "@langchain/community/vectorstores/chroma";

export async function getRetriever() {

    const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small", });

    const vectorStore = await Chroma.fromExistingCollection(embeddings, {
        collectionName: "rag-docs",
        url: "http://localhost:8081",
    }
    );

    return vectorStore.asRetriever(3);
}