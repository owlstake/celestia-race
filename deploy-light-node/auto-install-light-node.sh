#!/bin/bash
# Update system
sudo apt update && sudo apt upgrade -y
echo "Update finished"

# Install package
sudo apt install curl tar wget clang pkg-config libssl-dev jq build-essential git make ncdu -y
echo "Install package finished"

# Install golang
ver="1.19.1" 
cd $HOME 
wget "https://golang.org/dl/go$ver.linux-amd64.tar.gz" 
sudo rm -rf /usr/local/go 
sudo tar -C /usr/local -xzf "go$ver.linux-amd64.tar.gz" 
rm "go$ver.linux-amd64.tar.gz"
go version
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> $HOME/.bash_profile
source $HOME/.bash_profile
echo "Install golang finished"

# Install Celestia-node
cd $HOME 
rm -rf celestia-node 
git clone https://github.com/celestiaorg/celestia-node.git 
cd celestia-node/ 
git checkout tags/v0.8.1 
make build 
make install 
make cel-key
celestia version
echo "Install Celestia node finished"

# Initialize the light node
celestia light init --p2p.network blockspacerace >> $HOME/data-key.txt
echo "init the light node and here is the key"
cat $HOME/data-key.txt

# Install systemd
sudo tee <<EOF >/dev/null /etc/systemd/system/celestia-lightd.service
[Unit]
Description=celestia-lightd Light Node
After=network-online.target

[Service]
User=$USER
ExecStart=$(which celestia) light start --core.ip https://rpc-blockspacerace.pops.one --core.rpc.port 26657 --core.grpc.port 9090 --keyring.accname my_celes_key --metrics.tls=false --metrics --metrics.endpoint otel.celestia.tools:4318 --gateway --gateway.addr localhost --gateway.port 26659 --p2p.network blockspacerace
Restart=on-failure
RestartSec=3
LimitNOFILE=4096

[Install]
WantedBy=multi-user.target
EOF
echo "Install systemd finished"

# Reload, enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable celestia-lightd
sudo systemctl start celestia-lightd
echo "node is running"

# show the NodeID
NODE_TYPE=light
AUTH_TOKEN=$(celestia $NODE_TYPE auth admin --p2p.network blockspacerace)
echo "Node ID below here:"
curl -X POST -H "Authorization: Bearer $AUTH_TOKEN" -H 'Content-Type: application/json' -d '{"jsonrpc":"2.0","id":0,"method":"p2p.Info","params":[]}' http://localhost:26658 | jq -r '.result.ID'

# backup the node
tar -czvf /home/backup-celestia.tar.gz $HOME/.celestia-light-blockspacerace-0/* 
echo "File backup is locale on /home/"
echo "Remember backup file in /home/backup-celestia.tar.gz and $HOME/data-key.txt"

