import express from 'express';
import { ChatGroq } from '@langchain/groq';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/explain', async (req, res) => {
  const { clause } = req.body;
  console.log('📩 Received clause:', clause);

  try {
    const model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: 'llama3-8b-8192', // ✅ FIX: property should be `model`, not `modelName`
    });

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', 'You are a legal assistant. Explain the clause in simple terms and mention any legal risks.'],
      ['user', 'Clause: {clause}'],
    ]);

    const chain = prompt.pipe(model).pipe(new StringOutputParser());

    const output = await chain.invoke({ clause });
    console.log('✅ Groq Output:', output);

    res.json({ explanation: output });
  } catch (err) {
    console.error('❌ Groq API Error:', err);
    res.status(500).json({ error: 'Groq API Error' });
  }
});

export default router;
