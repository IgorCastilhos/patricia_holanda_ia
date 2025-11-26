# 🚀 Deploy na VPS Hostinger - Guia Completo

## 📋 Pré-requisitos

1. **Acesso SSH à VPS**
   - IP da VPS
   - Usuário e senha (ou chave SSH)
   
2. **Docker instalado**
   - Se não estiver instalado, veja a seção "Instalação do Docker"

## 🔧 Instalação do Docker (se necessário)

### Ubuntu 20.04/22.04

```bash
# Atualizar pacotes
sudo apt update
sudo apt upgrade -y

# Instalar dependências
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Adicionar repositório oficial do Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Iniciar e habilitar Docker
sudo systemctl start docker
sudo systemctl enable docker

# Adicionar usuário ao grupo docker (para não precisar de sudo)
sudo usermod -aG docker $USER

# Aplicar mudanças (ou faça logout/login)
newgrp docker

# Verificar instalação
docker --version
docker compose version
```

### CentOS/RHEL 8

```bash
# Atualizar sistema
sudo dnf update -y

# Instalar Docker
sudo dnf install -y docker docker-compose-plugin

# Iniciar e habilitar Docker
sudo systemctl start docker
sudo systemctl enable docker

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
newgrp docker

# Verificar instalação
docker --version
docker compose version
```

## 📦 Deploy da Aplicação

### 1. Conectar via SSH
```bash
ssh usuario@seu-ip-vps
```

### 2. Fazer Upload do Projeto

#### Opção A: Via Git (Recomendado)
```bash
# Instalar Git (se necessário)
sudo apt install git -y  # Ubuntu
sudo dnf install git -y  # CentOS

# Clonar repositório
cd ~
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

#### Opção B: Via SCP (do seu computador local)
```bash
# Na sua máquina local
scp -r /caminho/do/projeto usuario@seu-ip-vps:~/mesa-cosmica
```

#### Opção C: Via SFTP/FTP
Use um cliente como FileZilla para fazer upload dos arquivos.

### 3. Executar Deploy

```bash
# Dar permissão de execução aos scripts
chmod +x deploy.sh init-ollama.sh

# Executar deploy automatizado
./deploy.sh
```

Se preferir fazer manualmente:
```bash
# Build e iniciar containers
docker compose up -d --build

# Aguardar e inicializar modelo
sleep 30
./init-ollama.sh
```

### 4. Verificar Status

```bash
# Ver status dos containers
docker compose ps

# Ver logs
docker compose logs -f
```

## 🌐 Configurar Domínio (Opcional)

### Apontar Domínio para VPS

1. **No painel do seu domínio**, adicione um registro A:
   - Nome: @ (ou www)
   - Tipo: A
   - Valor: IP da sua VPS
   - TTL: 3600

2. **Aguarde propagação** (pode levar até 48h, mas geralmente é rápido)

### Configurar SSL com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Parar o nginx do container temporariamente
docker compose stop frontend

# Obter certificado
sudo certbot certonly --standalone -d seudominio.com -d www.seudominio.com

# Os certificados estarão em:
# /etc/letsencrypt/live/seudominio.com/fullchain.pem
# /etc/letsencrypt/live/seudominio.com/privkey.pem
```

Depois, atualize o `docker-compose.yml`:
```yaml
services:
  frontend:
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
```

E o `frontend/nginx.conf`:
```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name seudominio.com www.seudominio.com;
    
    ssl_certificate /etc/letsencrypt/live/seudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seudominio.com/privkey.pem;
    
    # ... resto da configuração
}
```

## 🔒 Configurar Firewall

### Ubuntu (UFW)
```bash
# Instalar UFW
sudo apt install ufw -y

# Configurar regras
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Habilitar firewall
sudo ufw enable

# Verificar status
sudo ufw status
```

### CentOS/RHEL (firewalld)
```bash
# Habilitar firewalld
sudo systemctl start firewalld
sudo systemctl enable firewalld

# Configurar regras
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https

# Recarregar
sudo firewall-cmd --reload

# Verificar
sudo firewall-cmd --list-all
```

## 📊 Monitoramento

### Configurar Auto-restart

Os containers já estão configurados com `restart: unless-stopped`, mas você pode garantir que o Docker inicie com o sistema:

```bash
sudo systemctl enable docker
```

### Verificar Logs do Sistema

```bash
# Logs do Docker
sudo journalctl -u docker -f

# Logs da aplicação
docker compose logs -f
```

### Monitorar Recursos

```bash
# Instalar htop (opcional)
sudo apt install htop -y

# Ver uso de recursos
htop

# Ou usar docker stats
docker stats
```

## 🔄 Atualizações

### Atualizar Aplicação

```bash
# Fazer backup (opcional)
docker run --rm -v teste_ia_ollama_data:/data -v $(pwd):/backup alpine tar czf /backup/ollama-backup-$(date +%Y%m%d).tar.gz -C /data .

# Puxar atualizações
git pull

# Rebuild e restart
docker compose up -d --build

# Se necessário, reinicializar modelo
./init-ollama.sh
```

### Atualizar Sistema

```bash
# Ubuntu
sudo apt update && sudo apt upgrade -y

# CentOS
sudo dnf update -y

# Reiniciar se necessário
sudo reboot
```

## 🆘 Troubleshooting

### Porta 80 já está em uso

```bash
# Ver o que está usando a porta
sudo lsof -i :80

# Se for Apache ou Nginx instalado no sistema
sudo systemctl stop apache2   # Ubuntu
sudo systemctl stop nginx
sudo systemctl disable apache2
sudo systemctl disable nginx
```

### Containers não iniciam

```bash
# Ver logs detalhados
docker compose logs

# Verificar recursos
free -h
df -h

# Se falta memória, considere usar swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Problemas de DNS

```bash
# Testar conectividade
ping google.com

# Verificar DNS
cat /etc/resolv.conf

# Se necessário, adicionar DNS público
echo "nameserver 8.8.8.8" | sudo tee -a /etc/resolv.conf
```

### Ollama não baixa modelos

```bash
# Verificar espaço em disco
df -h

# Verificar conectividade do container
docker exec $(docker compose ps -q ollama) ping -c 3 google.com

# Tentar baixar manualmente
docker exec -it $(docker compose ps -q ollama) sh
ollama pull llama3
```

## 💾 Backup e Restore

### Backup Completo

```bash
# Criar diretório de backup
mkdir -p ~/backups

# Backup do código
tar czf ~/backups/app-$(date +%Y%m%d).tar.gz .

# Backup dos dados do Ollama
docker run --rm -v teste_ia_ollama_data:/data -v ~/backups:/backup alpine tar czf /backup/ollama-$(date +%Y%m%d).tar.gz -C /data .
```

### Restore

```bash
# Restaurar código
tar xzf ~/backups/app-YYYYMMDD.tar.gz -C ~/mesa-cosmica

# Restaurar dados do Ollama
docker run --rm -v teste_ia_ollama_data:/data -v ~/backups:/backup alpine sh -c "cd /data && tar xzf /backup/ollama-YYYYMMDD.tar.gz"

# Reiniciar
cd ~/mesa-cosmica
docker compose down
docker compose up -d
```

## 🎯 Checklist Pós-Deploy

- [ ] Aplicação acessível via IP/domínio
- [ ] Frontend carregando corretamente
- [ ] Backend respondendo em /api/chat
- [ ] Modelo Ollama criado e funcionando
- [ ] Firewall configurado
- [ ] SSL configurado (se usar domínio)
- [ ] Logs sendo gerados sem erros
- [ ] Auto-restart configurado
- [ ] Backup agendado (considere usar cron)

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs: `docker compose logs -f`
2. Veja o arquivo COMANDOS.md para comandos úteis
3. Consulte a documentação do Docker
4. Verifique o suporte da Hostinger

## 🌟 Otimizações Recomendadas

### 1. Configurar Swap (se VPS tem pouca RAM)
```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 2. Limpar Docker periodicamente
Adicione ao crontab (`crontab -e`):
```
0 3 * * 0 docker system prune -af --volumes
```

### 3. Monitorar logs
```bash
# Limitar tamanho dos logs (adicionar ao docker-compose.yml)
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

---

✨ **Boa sorte com o deploy da Mesa Cósmica!** ✨

