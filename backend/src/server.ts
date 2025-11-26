import express, { Request, Response } from 'express';
import cors from 'cors';
import { Ollama } from 'ollama';

// Configuração
const app = express();
const PORT = 3001;
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';

// Middleware
app.use(cors());
app.use(express.json());

// Dependency Injection (Manual para o protótipo)
const ollama = new Ollama({ host: OLLAMA_HOST });

// Interface do Domain
interface ChatRequest {
  message: string;
  history?: { role: string; content: string }[];
}

// Controller (Presentation Layer)
app.get('/api/health', (req: Request, res: Response): void => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Mesa Cósmica Backend'
  });
});

app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, history } = req.body as ChatRequest;

    if (!message) {
      res.status(400).json({ error: 'Mensagem é obrigatória.' });
      return;
    }

    // Montagem do contexto (mantendo histórico curto para o protótipo)
    const messages = [
      ...(history?.map((h) => ({ role: h.role, content: h.content })) || []),
      { role: 'user', content: message },
    ];

    // Streaming Response (Melhor UX para chat)
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    const stream = await ollama.chat({
      model: 'arcangelina', // Nossa persona criada anteriormente
      messages: messages as any,
      stream: true,
    });

    for await (const part of stream) {
      res.write(part.message.content);
    }

    res.end();
  } catch (error) {
    console.error('Erro na comunicação com Ollama:', error);
    res.status(500).json({ error: 'As estrelas estão nebulosas hoje...' });
  }
});

app.listen(PORT, () => {
  console.log(`✨ Portal Cósmico aberto em http://localhost:${PORT}`);
});