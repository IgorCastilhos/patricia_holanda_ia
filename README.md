# Mesa Cósmica Arcangelina Fé

Sistema de chat com IA usando Ollama, React e Node.js.

## 🚀 Deploy na Hostinger (ou qualquer VPS)

### ✨ Processo Automático

Este projeto está configurado para **inicialização 100% automática**! 

Quando você enviar o repositório para a Hostinger e ela executar o `docker-compose up`, o sistema vai:

1. ✅ Subir o container do Ollama
2. ✅ **Criar automaticamente o modelo "arcangelina"** usando o Modelfile
3. ✅ Subir o backend conectado ao Ollama
4. ✅ Subir o frontend

**Não é necessário executar nenhum comando shell manual!** 🎉

### Pré-requisitos na VPS
- Docker e Docker Compose instalados
- Portas 80, 3001 e 11434 liberadas no firewall

### Como Funciona

O `docker-compose.yml` foi configurado para:
- Montar o `Modelfile` dentro do container do Ollama
- Executar automaticamente um script de inicialização que:
  - Verifica se o modelo "arcangelina" existe
  - Se não existir, cria o modelo usando `ollama create arcangelina -f /tmp/Modelfile`
  - Mantém o serviço rodando

### 🔍 Comandos Úteis (Opcional)

**Ver logs para acompanhar a criação do modelo:**
```bash
docker compose logs -f ollama
```

**Ver status de todos os serviços:**
```bash
docker compose ps
```

**Reiniciar todos os serviços:**
```bash
docker compose restart
```

**Parar todos os serviços:**
```bash
docker compose down
```

### 🌐 Acessando a Aplicação

Após o deploy, acesse:
- **Frontend:** http://seu-ip-ou-dominio
- **Backend API:** http://seu-ip-ou-dominio:3001/api/chat
- **Ollama:** http://seu-ip-ou-dominio:11434

### 🔧 Troubleshooting

**Se o chat não responder imediatamente:**
- O modelo pode estar sendo criado (leva 1-3 minutos na primeira vez)
- Verifique os logs: `docker compose logs -f ollama`
- Aguarde a mensagem "✨ Modelo 'arcangelina' criado com sucesso!"

**Para verificar se o modelo foi criado:**
```bash
docker exec -it $(docker ps -qf "name=ollama") ollama list
```

Você deve ver "arcangelina" na lista.

**Para recriar o modelo (se necessário):**
```bash
docker compose down
docker volume rm teste_ia_ollama_data
docker compose up -d --build
```
ollama create arcangelina -f /tmp/Modelfile
```

**Se o backend não conectar ao Ollama:**
```bash
# Verifique se o container do Ollama está rodando
docker ps | grep ollama

# Verifique os logs
docker compose logs ollama
```

**Problemas de build:**
```bash
# Limpe tudo e reconstrua
docker compose down -v
docker system prune -a
docker compose up -d --build
```

### 📦 Estrutura dos Serviços

- **Frontend (porta 80):** Interface React com Nginx
- **Backend (porta 3001):** API Node.js/Express com TypeScript
- **Ollama (porta 11434):** Motor de IA com modelo customizado

### 🔐 Segurança (Recomendações)

Para produção, considere:
1. Usar HTTPS com certificado SSL (Let's Encrypt)
2. Configurar firewall (ufw/iptables)
3. Usar variáveis de ambiente para secrets
4. Implementar rate limiting
5. Configurar backup dos volumes Docker

### 📝 Variáveis de Ambiente

O backend usa as seguintes variáveis (definidas no docker-compose.yml):
- `OLLAMA_HOST`: URL do serviço Ollama
- `OLLAMA_MODEL`: Nome do modelo a ser usado

### 🔄 Atualizações

Para atualizar a aplicação:
```bash
git pull
docker compose up -d --build
```

## 💻 Desenvolvimento Local

```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run dev

# Ollama (localmente)
ollama pull llama3
ollama create arcangelina -f ../Modelfile
```

