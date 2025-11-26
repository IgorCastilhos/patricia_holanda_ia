# Mesa Cósmica Arcangelina Fé

Sistema de chat com IA usando Ollama, React e Node.js.

## 🚀 Deploy na VPS Hostinger

### Pré-requisitos
- VPS com Docker e Docker Compose instalados
- Portas 80, 3001 e 11434 liberadas no firewall
- Git instalado

### Passo a Passo

1. **Clone o repositório na VPS:**
```bash
git clone <seu-repositorio>
cd teste_ia
```

2. **Inicie os containers:**
```bash
docker compose up -d --build
```

3. **Aguarde os containers iniciarem (cerca de 1-2 minutos) e inicialize o modelo Ollama:**
```bash
chmod +x init-ollama.sh
./init-ollama.sh
```

4. **Verifique o status:**
```bash
docker compose ps
```

### 🔍 Comandos Úteis

**Ver logs:**
```bash
# Todos os serviços
docker compose logs -f

# Apenas um serviço
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f ollama
```

**Reiniciar serviços:**
```bash
docker compose restart
```

**Parar todos os serviços:**
```bash
docker compose down
```

**Parar e remover volumes:**
```bash
docker compose down -v
```

**Acessar o shell de um container:**
```bash
docker exec -it <container-name> sh
```

### 🌐 Acessando a Aplicação

Após o deploy, acesse:
- **Frontend:** http://seu-ip-ou-dominio
- **Backend API:** http://seu-ip-ou-dominio/api/chat
- **Ollama:** http://seu-ip-ou-dominio:11434

### 🔧 Troubleshooting

**Se o modelo não funcionar:**
```bash
# Entre no container do Ollama
docker exec -it $(docker ps -qf "name=ollama") sh

# Liste os modelos
ollama list

# Recrie o modelo
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

