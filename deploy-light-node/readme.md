# Hardware requirements

The following minimum hardware requirements are recommended for running a light node:

   Memory: 2 GB RAM
   
   CPU: Single Core
   
   Disk: 5 GB SSD Storage
   
   Bandwidth: 56 Kbps for Download/56 Kbps for Upload
   
# Deploy automatically
```
wget -O auto-install-light-node.sh https://raw.githubusercontent.com/owlstake/celestia-race/main/deploy-light-node/auto-install-light-node.sh && chmod +x auto-install-light-node.sh && ./auto-install-light-node.sh
```

# Deploy manuallly
```
# Update system
sudo apt update && sudo apt upgrade -y

# Install packages
sudo apt install curl tar wget clang pkg-config libssl-dev jq build-essential git make ncdu -y

# Install golang
ver="1.20.3" 
cd $HOME 
wget "https://golang.org/dl/go$ver.linux-amd64.tar.gz" 
sudo rm -rf /usr/local/go 
sudo tar -C /usr/local -xzf "go$ver.linux-amd64.tar.gz" 
rm "go$ver.linux-amd64.tar.gz"
go version
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> $HOME/.bash_profile
source $HOME/.bash_profile

# Install Celestia-node
cd $HOME 
rm -rf celestia-node 
git clone https://github.com/celestiaorg/celestia-node.git 
cd celestia-node/ 
git checkout tags/v0.9.4 
make build 
make install 
make cel-key
celestia version

# Initialize the light node
celestia light init --p2p.network blockspacerace >> $HOME/data-key.txt

# Install systemd
sudo tee <<EOF >/dev/null /etc/systemd/system/celestia-lightd.service
[Unit]
Description=celestia-lightd Light Node
After=network-online.target

[Service]
User=$USER
ExecStart=$(which celestia) light start --core.ip https://rpc-blockspacerace.pops.one --core.rpc.port 26657 --core.grpc.port 9090 --keyring.accname my_celes_key --metrics.tls=false --metrics --metrics.endpoint otel.celestia.tools:4318 --gateway --gateway.addr 0.0.0.0 --gateway.port 26659 --p2p.network blockspacerace
Restart=on-failure
RestartSec=3
LimitNOFILE=4096

[Install]
WantedBy=multi-user.target
EOF

# Reload, enable, and start the service
sudo systemctl daemon-reload
sudo systemctl enable celestia-lightd
sudo systemctl start celestia-lightd
```

# Show the NodeID
```
NODE_TYPE=light
AUTH_TOKEN=$(celestia $NODE_TYPE auth admin --p2p.network blockspacerace)
curl -X POST -H "Authorization: Bearer $AUTH_TOKEN" -H 'Content-Type: application/json' -d '{"jsonrpc":"2.0","id":0,"method":"p2p.Info","params":[]}' http://localhost:26658 | jq -r '.result.ID'
```
# Backup the data
```
tar -czvf /home/backup-celestia.tar.gz $HOME/.celestia-light-blockspacerace-0/* 
```
### After that you can use WinSCP to copy the backup data to a safe location

and remember to backup the file located in $HOME/data-key.txt too (your celestia seed key)
