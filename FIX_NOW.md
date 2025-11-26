# 🆘 Correção dos Erros Atuais

## Problemas Identificados

### 1. ❌ Modelo 'arcangelina' não encontrado
```
ResponseError: model 'arcangelina' not found
```

### 2. ❌ Conflito de headers HTTP
```
upstream sent "Content-Length" and "Transfer-Encoding" headers at the same time
```

---

## ✅ Soluções Aplicadas

### 1. **Correção do Backend** (server.ts)
- Removido header `Transfer-Encoding` manual
- Adicionados headers corretos para streaming
- Melhorado tratamento de erro quando modelo não existe

### 2. **Correção do Nginx** (nginx.conf)
- Configuração otimizada para streaming
- Adicionado `chunked_transfer_encoding on`
- Removido conflito de headers

### 3. **Scripts de Configuração**
- `setup-model.sh` - Configura o modelo Ollama
- `fix-complete.sh` - Aplica todas as correções

---

## 🚀 Como Aplicar na VPS (AGORA)

### Opção 1: Automática (Recomendado)

```bash
cd ~/teste_ia  # ou o diretório do seu projeto
git pull       # atualizar código
chmod +x fix-complete.sh
./fix-complete.sh
```

### Opção 2: Manual

```bash
# 1. Parar e rebuild
docker compose down
docker compose up -d --build

# 2. Aguardar containers iniciarem
sleep 20

# 3. Configurar modelo
chmod +x setup-model.sh
./setup-model.sh
```

### Opção 3: Apenas criar o modelo (se já fez rebuild)

```bash
chmod +x setup-model.sh
./setup-model.sh
```

---

## 🔍 Verificação

### 1. Verificar se modelo foi criado

```bash
docker exec $(docker compose ps -q ollama) ollama list
```

Deve aparecer:
```
NAME            ID              SIZE    MODIFIED
arcangelina:... ...             ...     ... seconds ago
llama3:...      ...             ...     ... ago
```

### 2. Testar modelo

```bash
docker exec -it $(docker compose ps -q ollama) ollama run arcangelina "Olá"
```

### 3. Testar API

```bash
curl -X POST http://localhost/api/health
```

### 4. Ver logs

```bash
docker compose logs -f backend
```

---

## 📋 O que foi alterado

### backend/src/server.ts
```typescript
// ANTES
res.setHeader('Transfer-Encoding', 'chunked');

// DEPOIS
res.setHeader('Cache-Control', 'no-cache');
res.setHeader('Connection', 'keep-alive');
res.flushHeaders();
```

### frontend/nginx.conf
```nginx
# ADICIONADO
chunked_transfer_encoding on;
proxy_cache off;
proxy_set_header Transfer-Encoding $http_transfer_encoding;
```

---

## ⏱️ Tempo de Aplicação

- Opção 1 (Automática): ~3-5 minutos
- Opção 2 (Manual): ~2-3 minutos  
- Opção 3 (Apenas modelo): ~1-2 minutos

---

## 🆘 Se ainda der erro

### Erro: Container ollama não está rodando
```bash
docker compose up -d ollama
sleep 10
./setup-model.sh
```

### Erro: Modelfile não encontrado
```bash
# Verificar se existe
ls -la Modelfile

# Se não existir, está na raiz do projeto
```

### Erro: Ollama não responde
```bash
# Reiniciar Ollama
docker compose restart ollama
sleep 15
./setup-model.sh
```

### Erro 502 ainda aparece
```bash
# Rebuild completo
docker compose down -v
docker compose up -d --build
sleep 30
./setup-model.sh
```

---

## 📊 Comandos de Debug

```bash
# Ver todos os logs
docker compose logs

# Logs apenas do backend
docker compose logs backend | tail -50

# Logs apenas do ollama
docker compose logs ollama | tail -50

# Status dos containers
docker compose ps

# Entrar no container do Ollama
docker exec -it $(docker compose ps -q ollama) sh
```

---

## ✅ Checklist Pós-Correção

- [ ] Containers rodando: `docker compose ps`
- [ ] Modelo criado: `docker exec $(docker compose ps -q ollama) ollama list`
- [ ] Backend respondendo: `curl http://localhost/api/health`
- [ ] Sem erro 502 nos logs
- [ ] Chat funcionando no navegador

---

**Aplique as correções agora e teste o chat!** 🌟

