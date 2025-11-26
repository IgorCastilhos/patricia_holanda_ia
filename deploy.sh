#!/bin/bash

set -e

echo "🚀 Iniciando deploy da Mesa Cósmica Arcangelina Fé..."
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verifica se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não está instalado!${NC}"
    echo "Instale o Docker primeiro: https://docs.docker.com/engine/install/"
    exit 1
fi

# Verifica se Docker Compose está instalado
if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose não está instalado!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker e Docker Compose encontrados${NC}"
echo ""

# Para containers existentes (se houver)
echo -e "${YELLOW}🔄 Parando containers existentes...${NC}"
docker compose down 2>/dev/null || true

# Build e inicia os containers
echo -e "${YELLOW}🏗️  Construindo e iniciando containers...${NC}"
docker compose up -d --build

# Aguarda os containers iniciarem
echo -e "${YELLOW}⏳ Aguardando containers iniciarem...${NC}"
sleep 5

# Verifica o status dos containers
echo ""
echo -e "${YELLOW}📊 Status dos containers:${NC}"
docker compose ps

# Aguarda Ollama estar pronto
echo ""
echo -e "${YELLOW}🔮 Aguardando Ollama estar pronto...${NC}"
sleep 15

# Obter o nome do container do Ollama
OLLAMA_CONTAINER=$(docker ps --filter "name=ollama" --format "{{.Names}}" | head -n 1)

if [ -z "$OLLAMA_CONTAINER" ]; then
    echo -e "${RED}❌ Container Ollama não encontrado!${NC}"
    echo "Verifique os logs: docker compose logs ollama"
    exit 1
fi

echo -e "${GREEN}✅ Container Ollama encontrado: $OLLAMA_CONTAINER${NC}"

# Baixa o modelo base
echo ""
echo -e "${YELLOW}📥 Baixando modelo base llama3...${NC}"
docker exec $OLLAMA_CONTAINER ollama pull llama3

# Cria o modelo customizado
echo ""
echo -e "${YELLOW}✨ Criando modelo customizado 'arcangelina'...${NC}"
docker exec $OLLAMA_CONTAINER ollama create arcangelina -f /tmp/Modelfile

# Lista os modelos
echo ""
echo -e "${YELLOW}📋 Modelos disponíveis:${NC}"
docker exec $OLLAMA_CONTAINER ollama list

# Resumo final
echo ""
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}✨ Deploy concluído com sucesso! ✨${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo ""
echo -e "🌐 Acesse a aplicação em:"
echo -e "   ${YELLOW}http://$(hostname -I | awk '{print $1}')${NC}"
echo -e "   ou"
echo -e "   ${YELLOW}http://localhost${NC} (se estiver na máquina local)"
echo ""
echo -e "📊 Para ver os logs:"
echo -e "   ${YELLOW}docker compose logs -f${NC}"
echo ""
echo -e "🔧 Para parar a aplicação:"
echo -e "   ${YELLOW}docker compose down${NC}"
echo ""
echo -e "${GREEN}🎉 A Mesa Cósmica está preparada!${NC}"

