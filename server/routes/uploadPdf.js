import express from 'express';
import multer from 'multer';


import fetch from 'node-fetch';
import dotenv from 'dotenv';

import pkg from 'pdfjs-dist/legacy/build/pdf.js';
const { getDocument } = pkg;
import fs from 'fs';
dotenv.config();

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

function splitTextIntoChunks(text, maxLength = 1000) {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const chunks = [];

  let current = '';
  for (let p of paragraphs) {
    if ((current + p).length > maxLength) {
      chunks.push(current.trim());
      current = p + '\n\n';
    } else {
      current += p + '\n\n';
    }
  }
  if (current.trim().length) chunks.push(current.trim());

  return chunks.slice(0, 50); // limit to 50 chunks for safety
}

async function analyzeClause(clauseText) {
  const prompt = `
You are a legal assistant AI. Analyze the clause and return a JSON object like this:

{
  "clause": "...",
  "explanation": "...",
  "risks": ["..."],
  "suggestions": ["..."]
}

Clause:
"""${clauseText}"""
`;

  try {
    const res = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    const data = await res.json();

    console.log('🔍 Gemini raw:', JSON.stringify(data, null, 2));

    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText || rawText.trim().length === 0) {
      console.error('❌ Gemini returned empty or missing content:', JSON.stringify(data, null, 2));
      throw new Error('Empty Gemini response');
    }
    
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn('⚠️ Fallback used due to Gemini error:', err.message);
    return {
      clause: clauseText,
      explanation: 'No valid response from Gemini.',
      risks: [],
      suggestions: [],
    };
  }
}

router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    const pdfPath = req.file.path;
    const dataBuffer = new Uint8Array(fs.readFileSync(pdfPath));
    const pdfDoc = await getDocument({ data: dataBuffer }).promise;

    let fullText = '';
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map(item => item.str);
      fullText += strings.join(' ') + '\n\n';
}
    console.log('📄 Extracted text length:', fullText.length);

    const chunks = splitTextIntoChunks(fullText);
    console.log('✂️ Paragraphs found:', chunks.length);

    const results = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`🤖 Analyzing clause ${i + 1}: ${chunk.substring(0, 80)}...`);
      const result = await analyzeClause(chunk);
      results.push(result);
    }

    fs.unlinkSync(pdfPath); // cleanup
    console.log('📦 Sending final response:', JSON.stringify(results, null, 2));

    res.json(results);
  } catch (error) {
    console.error('❌ Error in /upload-pdf:', error);
    res.status(500).json({ error: 'Failed to process PDF' });
  }
});

export default router;