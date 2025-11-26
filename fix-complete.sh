#!/bin/bash

echo "🚀 Aplicando correções completas..."
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}1. Parando containers...${NC}"
docker compose down

echo ""
echo -e "${YELLOW}2. Rebuild dos containers com correções...${NC}"
docker compose up -d --build

echo ""
echo -e "${YELLOW}3. Aguardando containers iniciarem...${NC}"
sleep 15

echo ""
echo -e "${YELLOW}4. Verificando status...${NC}"
docker compose ps

echo ""
echo -e "${YELLOW}5. Aguardando Ollama estar pronto...${NC}"
sleep 10

echo ""
echo -e "${YELLOW}6. Configurando modelo Ollama...${NC}"
chmod +x setup-model.sh
./setup-model.sh

echo ""
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Correções aplicadas com sucesso! ✅${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo ""
echo "🌐 Acesse: http://$(hostname -I | awk '{print $1}')"
echo ""
echo "📊 Logs:"
echo "   docker compose logs -f"
echo ""
echo "🧪 Teste a API:"
echo "   curl -X POST http://localhost/api/health"

