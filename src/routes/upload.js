import express from "express";
import multer from "multer";

import { extractPdfText } from "../utils/pdf.js";

import { ingestDocument } from "../rag/ingest.js";
import { cleanPdfText } from "../utils/clean.js";

const router = express.Router();

const upload = multer({ dest: "uploads/", });

router.post("/", upload.single("file"), async (req, res) => {

    try {
        if (!req.file) {
            return res.status(400).json({
                error: "No file uploaded",
            });
        }


        const text = await extractPdfText(req.file.path);

        const cleanedText = cleanPdfText(text);

        const chunks = await ingestDocument(cleanedText, req.file.originalname);

        res.json({
            success: true,
            chunks,
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Upload failed",
        });
    }
}
);

export default router;