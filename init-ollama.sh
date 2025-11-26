#!/bin/bash

echo "🌟 Aguardando Ollama iniciar..."
sleep 15

# Obter o nome do container do Ollama
OLLAMA_CONTAINER=$(docker ps --filter "name=ollama" --format "{{.Names}}" | head -n 1)

if [ -z "$OLLAMA_CONTAINER" ]; then
    echo "❌ Container Ollama não encontrado!"
    exit 1
fi

echo "📦 Container encontrado: $OLLAMA_CONTAINER"

echo "🔮 Verificando se o modelo base existe..."
docker exec $OLLAMA_CONTAINER ollama pull llama3

echo "✨ Criando modelo arcangelina..."
docker exec $OLLAMA_CONTAINER ollama create arcangelina -f /tmp/Modelfile

echo "✅ Modelo criado com sucesso!"
echo "🌟 Testando modelo..."
docker exec $OLLAMA_CONTAINER ollama list

echo "🎉 Tudo pronto! A Mesa Cósmica está preparada!"
