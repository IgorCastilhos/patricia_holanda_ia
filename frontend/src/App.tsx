import { useState, useRef, useEffect } from 'react';
import arcangelinaAvatar from './assets/arcangelina.png';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setIsLoading(true);
    
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: messages
        }),
      });

      if (!response.body) throw new Error("Sem resposta das estrelas");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botReply = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        botReply += chunk;

        setMessages(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].content = botReply;
          return newHistory;
        });
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "O cosmos está silencioso... (Erro de conexão)" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900">
      {/* Animated Cosmic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Stars */}
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
        
        {/* Nebula Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse-slower"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px] animate-float"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center min-h-screen">
        {/* Mystical Header */}
        <header className="w-full max-w-4xl p-8 flex flex-col items-center backdrop-blur-xl bg-black/20 border-b border-purple-500/30 shadow-[0_8px_32px_0_rgba(168,85,247,0.2)] sticky top-0 z-50">
          <div className="relative group">
            {/* Orbital Rings */}
            <div className="absolute inset-0 -m-8">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-purple-400/30 rounded-full animate-spin-slow"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-pink-400/20 rounded-full animate-spin-reverse"></div>
            </div>
            
            {/* Avatar */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse-slow"></div>
              <img
                src={arcangelinaAvatar}
                alt="Arcangelina - Oráculo Cósmico"
                className="relative w-32 h-32 rounded-full border-4 border-purple-400/50 shadow-[0_0_40px_rgba(168,85,247,0.6)] object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-3 border-slate-900 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse"></div>
            </div>
          </div>
          
          <h1 className="mt-6 text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 animate-gradient-x tracking-wider drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            ✨ Mesa Cósmica ✨
          </h1>
          <div className="mt-2 text-xl font-light text-purple-200/90 italic">
            Arcangelina · Oráculo das Estrelas
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-purple-300/70">
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,1)]"></span>
            <span>Conexão com o Cosmos Ativa</span>
          </div>
        </header>

        {/* Chat Container */}
        <main className="flex-1 w-full max-w-4xl px-6 py-8 overflow-y-auto">
          <div className="space-y-6">
            {/* Welcome Message */}
            {messages.length === 0 && (
              <div className="text-center space-y-6 mt-20 animate-fade-in">
                <div className="inline-block p-6 backdrop-blur-md bg-purple-900/30 border border-purple-400/30 rounded-3xl shadow-[0_8px_32px_0_rgba(168,85,247,0.3)]">
                  <div className="text-6xl mb-4 animate-float">🔮</div>
                  <p className="text-2xl text-purple-200 font-light italic mb-2">
                    "As cartas cósmicas estão dispostas..."
                  </p>
                  <p className="text-lg text-purple-300/70">
                    Qual mistério do universo você deseja desvendar?
                  </p>
                </div>
                
                {/* Suggestion Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto">
                  {[
                    { icon: '🌟', text: 'Leia meu destino', gradient: 'from-yellow-400/20 to-orange-500/20' },
                    { icon: '🌙', text: 'Guia espiritual', gradient: 'from-blue-400/20 to-purple-500/20' },
                    { icon: '✨', text: 'Mensagem cósmica', gradient: 'from-pink-400/20 to-purple-500/20' }
                  ].map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(suggestion.text)}
                      className={`p-4 backdrop-blur-md bg-gradient-to-br ${suggestion.gradient} border border-purple-400/20 rounded-2xl hover:border-purple-400/50 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/30`}
                    >
                      <div className="text-3xl mb-2">{suggestion.icon}</div>
                      <div className="text-sm text-purple-200">{suggestion.text}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Messages */}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in`}
              >
                <div className={`max-w-[75%] group ${msg.role === 'user' ? 'flex flex-col items-end' : 'flex flex-col items-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2 ml-4">
                      <img src={arcangelinaAvatar} alt="" className="w-8 h-8 rounded-full border-2 border-purple-400/50 shadow-lg" />
                      <span className="text-xs text-purple-300/80 font-medium">Arcangelina</span>
                    </div>
                  )}
                  
                  <div className={`p-5 rounded-3xl backdrop-blur-md shadow-2xl transition-all duration-300 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-purple-600/90 to-pink-600/90 text-white rounded-br-md border border-purple-400/30 shadow-[0_8px_24px_rgba(168,85,247,0.4)] group-hover:shadow-[0_8px_32px_rgba(168,85,247,0.6)]'
                      : 'bg-slate-800/60 text-purple-50 rounded-bl-md border border-purple-500/30 shadow-[0_8px_24px_rgba(0,0,0,0.4)] group-hover:shadow-[0_8px_32px_rgba(168,85,247,0.3)]'
                  }`}>
                    <div className="leading-relaxed whitespace-pre-wrap">
                      {msg.content || <span className="inline-block w-2 h-4 bg-purple-400 animate-pulse">|</span>}
                    </div>
                  </div>
                  
                  {msg.role === 'user' && (
                    <div className="flex items-center gap-2 mt-2 mr-4">
                      <span className="text-xs text-purple-300/60">Você</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Mystical Input Area */}
        <footer className="w-full max-w-4xl p-6 backdrop-blur-xl bg-black/20 border-t border-purple-500/30 shadow-[0_-8px_32px_0_rgba(168,85,247,0.2)]">
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 rounded-full blur-xl opacity-50"></div>
            
            <div className="relative flex items-center gap-3">
              <div className="flex-1 relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Consulte o cosmos... 🌌"
                  className="w-full bg-slate-900/80 backdrop-blur-md border-2 border-purple-500/30 text-white placeholder:text-purple-300/50 rounded-full py-4 px-8 pr-16 focus:outline-none focus:border-purple-400 focus:shadow-[0_0_24px_rgba(168,85,247,0.5)] transition-all duration-300 group-hover:border-purple-400/50"
                  disabled={isLoading}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl animate-float pointer-events-none">
                  ✨
                </div>
              </div>
              
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="relative p-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_24px_rgba(168,85,247,0.5)] hover:shadow-[0_4px_32px_rgba(168,85,247,0.7)] hover:scale-110 active:scale-95 group"
              >
                {isLoading ? (
                  <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-white group-hover:translate-x-0.5 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-4 text-center text-xs text-purple-400/50">
            Powered by Local AI · Sua privacidade é sagrada
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;