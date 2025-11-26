#!/bin/bash

echo "🌌 Aguardando Ollama iniciar..."
sleep 10

echo "✨ Verificando se o modelo 'arcangelina' já existe..."
if ollama list | grep -q "arcangelina"; then
    echo "🔮 Modelo 'arcangelina' já existe!"
else
    echo "🌟 Criando modelo 'arcangelina' a partir do Modelfile..."
    ollama create arcangelina -f /tmp/Modelfile
    echo "✨ Modelo 'arcangelina' criado com sucesso!"
fi

echo "🔮 Modelos disponíveis:"
ollama list

# Mantém o processo rodando
tail -f /dev/null

