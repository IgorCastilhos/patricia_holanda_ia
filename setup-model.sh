#!/bin/bash

echo "🔧 Corrigindo problemas do Ollama..."
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar se o container do Ollama está rodando
OLLAMA_CONTAINER=$(docker compose ps -q ollama)

if [ -z "$OLLAMA_CONTAINER" ]; then
    echo -e "${RED}❌ Container Ollama não está rodando!${NC}"
    echo "Inicie com: docker compose up -d ollama"
    exit 1
fi

echo -e "${GREEN}✅ Container Ollama encontrado${NC}"
echo ""

# Verificar se o Ollama está respondendo
echo -e "${YELLOW}📡 Verificando se Ollama está respondendo...${NC}"
sleep 3

HEALTH_CHECK=$(docker exec $OLLAMA_CONTAINER curl -s http://localhost:11434/api/tags 2>&1)
if [[ $HEALTH_CHECK == *"models"* ]]; then
    echo -e "${GREEN}✅ Ollama está respondendo${NC}"
else
    echo -e "${RED}❌ Ollama não está respondendo corretamente${NC}"
    echo "Aguardando 10 segundos..."
    sleep 10
fi

echo ""
echo -e "${YELLOW}📋 Modelos atualmente instalados:${NC}"
docker exec $OLLAMA_CONTAINER ollama list

echo ""
echo -e "${YELLOW}📥 Baixando modelo base llama3...${NC}"
docker exec $OLLAMA_CONTAINER ollama pull llama3

echo ""
echo -e "${YELLOW}✨ Criando modelo customizado 'arcangelina'...${NC}"

# Verificar se o Modelfile existe
if [ ! -f "./Modelfile" ]; then
    echo -e "${RED}❌ Arquivo Modelfile não encontrado!${NC}"
    exit 1
fi

# Criar o modelo
docker exec $OLLAMA_CONTAINER ollama create arcangelina -f /tmp/Modelfile

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Modelo 'arcangelina' criado com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro ao criar modelo${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}📋 Modelos após criação:${NC}"
docker exec $OLLAMA_CONTAINER ollama list

echo ""
echo -e "${YELLOW}🧪 Testando modelo arcangelina...${NC}"
TEST_RESULT=$(docker exec $OLLAMA_CONTAINER ollama run arcangelina "Diga olá" --verbose 2>&1 | head -n 5)
echo "$TEST_RESULT"

echo ""
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}✨ Modelo Ollama configurado com sucesso! ✨${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo ""
echo "🌟 Agora você pode testar o chat!"
echo ""
echo "📊 Para ver os logs do backend:"
echo "   docker compose logs -f backend"

