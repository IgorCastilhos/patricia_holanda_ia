# 📚 Comandos Úteis - Mesa Cósmica Arcangelina Fé

## 🚀 Deploy Inicial

### Opção 1: Script Automatizado (Recomendado)
```bash
chmod +x deploy.sh
./deploy.sh
```

### Opção 2: Passo a Passo Manual
```bash
# 1. Build e iniciar containers
docker compose up -d --build

# 2. Aguardar e inicializar Ollama
chmod +x init-ollama.sh
./init-ollama.sh
```

## 📊 Monitoramento

### Ver status dos containers
```bash
docker compose ps
```

### Ver logs em tempo real
```bash
# Todos os serviços
docker compose logs -f

# Serviço específico
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f ollama
```

### Ver últimas 100 linhas de log
```bash
docker compose logs --tail=100 backend
```

## 🔄 Gerenciamento

### Reiniciar todos os serviços
```bash
docker compose restart
```

### Reiniciar serviço específico
```bash
docker compose restart backend
```

### Parar todos os serviços
```bash
docker compose stop
```

### Parar e remover containers
```bash
docker compose down
```

### Parar e remover tudo (incluindo volumes)
```bash
docker compose down -v
```

## 🔍 Debugging

### Entrar no container
```bash
# Backend
docker exec -it $(docker compose ps -q backend) sh

# Frontend
docker exec -it $(docker compose ps -q frontend) sh

# Ollama
docker exec -it $(docker compose ps -q ollama) sh
```

### Verificar conectividade entre containers
```bash
# Do backend para o Ollama
docker exec $(docker compose ps -q backend) wget -qO- http://ollama:11434/api/tags
```

### Ver uso de recursos
```bash
docker stats
```

## 🤖 Ollama

### Listar modelos
```bash
docker exec $(docker compose ps -q ollama) ollama list
```

### Testar modelo
```bash
docker exec -it $(docker compose ps -q ollama) ollama run arcangelina "Olá, Arcangelina!"
```

### Baixar novo modelo
```bash
docker exec $(docker compose ps -q ollama) ollama pull llama3
```

### Recriar modelo customizado
```bash
docker exec $(docker compose ps -q ollama) ollama create arcangelina -f /tmp/Modelfile
```

### Remover modelo
```bash
docker exec $(docker compose ps -q ollama) ollama rm arcangelina
```

## 🔧 Manutenção

### Atualizar código
```bash
git pull
docker compose up -d --build
```

### Limpar cache do Docker
```bash
docker system prune -a
```

### Ver uso de espaço
```bash
docker system df
```

### Backup do volume do Ollama
```bash
docker run --rm -v teste_ia_ollama_data:/data -v $(pwd):/backup alpine tar czf /backup/ollama-backup.tar.gz -C /data .
```

### Restaurar backup
```bash
docker run --rm -v teste_ia_ollama_data:/data -v $(pwd):/backup alpine sh -c "cd /data && tar xzf /backup/ollama-backup.tar.gz"
```

## 🌐 Rede

### Ver IPs dos containers
```bash
docker compose ps -q | xargs docker inspect -f '{{.Name}} - {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'
```

### Testar porta aberta
```bash
# Do host
curl http://localhost/api/chat

# Verificar se Ollama está respondendo
curl http://localhost:11434/api/tags
```

## 📈 Performance

### Ver logs de performance
```bash
docker stats --no-stream
```

### Limitar recursos (editar docker-compose.yml)
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
```

## 🔐 Segurança

### Ver portas expostas
```bash
docker compose ps --format json | jq -r '.[] | "\(.Service): \(.Publishers)"'
```

### Atualizar imagens base
```bash
docker compose pull
docker compose up -d --build
```

## 🆘 Troubleshooting

### Container não inicia
```bash
# Ver erro específico
docker compose logs <service-name>

# Verificar saúde
docker compose ps
```

### Erro de porta em uso
```bash
# Ver o que está usando a porta
sudo lsof -i :80
sudo lsof -i :3001
sudo lsof -i :11434

# Matar processo
sudo kill -9 <PID>
```

### Rebuild completo
```bash
docker compose down -v
docker system prune -a -f
docker compose up -d --build
./init-ollama.sh
```

### Verificar variáveis de ambiente
```bash
docker compose config
```

## 📱 Firewall (se necessário)

### Ubuntu/Debian (UFW)
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw status
```

### CentOS/RHEL (firewalld)
```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## 🎯 One-liners úteis

```bash
# Reiniciar tudo rapidamente
docker compose down && docker compose up -d

# Ver logs dos últimos 5 minutos
docker compose logs --since 5m

# Seguir logs apenas de erros
docker compose logs -f | grep -i error

# Limpar tudo e começar do zero
docker compose down -v && docker system prune -a -f && docker compose up -d --build

# Verificar se todos os serviços estão "healthy"
docker compose ps | grep -v "Up"
```

