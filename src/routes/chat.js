import express from "express";

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { getRetriever } from "../rag/retriever.js";
import fs from 'fs/promises'

const router = express.Router();

router.post("/", async (req, res) => {

    try {

        const prompt = ChatPromptTemplate.fromMessages([
            [
                "system",
                `You are a strict context-based question answering system.

                Your job is NOT to summarize or explain broadly.
                Your job is ONLY to extract and reuse exact information from the context.

                RULES (VERY IMPORTANT):

                1. Use ONLY the text present in the <context>.
                   Do NOT use outside knowledge.

                2. Do NOT summarize, paraphrase broadly, or reorganize concepts.
                   You must stay as close as possible to the original phrasing.

                3. If the answer exists, extract ALL relevant sentences from the context.
                   Do NOT shorten or compress information.

                4. If multiple parts of the context contain relevant information, include ALL of them.

                5. Do NOT add explanations, definitions, or examples unless they are explicitly present in the context.

                6. If the answer is not explicitly present, respond exactly:
                   "I don't know based on the provided documents."

                7. Prefer quoting or near-verbatim extraction over rewriting.

                <context>
                {context}
                </context>
`
            ],
            [
                "user",
                `Question: {question}

Return only information that is explicitly present in the context.`
            ]
        ]);

        const { question } = req.body;

        const retriever = await getRetriever();

        const docs = await retriever.invoke(question);

        const context = docs.map((d, i) => `Document ${i + 1}:\n${d.pageContent}\n`).join("\n---\n");

        fs.writeFile('temp.txt', context)

        const formattedPrompt = await prompt.format({
            context,
            question,
        });

        const llm = new ChatOpenAI({
            model: "gpt-4o-mini",
            temperature: 0,
        });

        // const response = await llm.invoke([{
        //     role: "system",
        //     content:
        //         `Answer ONLY from context.

        //     Context:
        //     ${context}`
        // },
        // {
        //     role: "user",
        //     content: question,
        // },
        // ]);

        const response = await llm.invoke(formattedPrompt)
        res.json({
            answer: response.content,
            sources: docs.map((d) => d.metadata),
        });

        // console.log(docs)

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Chat failed",
        });
    }
});

export default router;