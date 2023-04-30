#!/bin/bash

#change your light node ip
echo "export LIGHT_NODE_IP=localhost" >> $HOME/.bash_profile

### update
sudo apt update && sudo apt upgrade -y
sudo apt install curl build-essential git wget jq make gcc ack tmux ncdu -y
sudo wget -qO /usr/local/bin/yq https://github.com/mikefarah/yq/releases/download/v4.27.3/yq_linux_amd64 && chmod +x /usr/local/bin/yq

# Install golang
ver="1.20" 
cd $HOME 
wget "https://golang.org/dl/go$ver.linux-amd64.tar.gz" 
sudo rm -rf /usr/local/go 
sudo tar -C /usr/local -xzf "go$ver.linux-amd64.tar.gz" 
rm "go$ver.linux-amd64.tar.gz"
go version
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> $HOME/.bash_profile
source $HOME/.bash_profile

# nodejs
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" 
nvm install v14.20.0

# Check the version to ensure successful installation of Node.js
node -v

#foundry
# If you do not want to use the redirect, feel free to manually download the foundryup installation script from here.
curl -L https://foundry.paradigm.xyz | bash

# Then, run foundryup in a new terminal session or after reloading your PATH.
source /root/.bashrc

# Other ways to use foundryup, and other documentation, can be found here. Happy forging!
foundryup

# install ethermint
cd ~
git clone https://github.com/celestiaorg/ethermint.git
cd ethermint
make install

#In the ethermint directory, we have a helpful bash script that allows you to instantiate a local Ethermint sovereign rollup on Celestia.
bash init.sh

echo "export NAMESPACE_ID=$(echo $RANDOM | md5sum | head -c 16; echo;)" >> $HOME/.bash_profile
echo "export DA_BLOCK_HEIGHT=$(curl https://rpc-blockspacerace.suntzu.pro/block | jq -r '.result.block.header.height')" >> $HOME/.bash_profile
source $HOME/.bash_profile
source /root/.bashrc

# create service
sudo tee /etc/systemd/system/ethermint-rollkitd.service > /dev/null <<EOF
[Unit]
Description=Ethermintd Service
After=network-online.target

[Service]
User=$USER
ExecStart=$(which ethermintd) start --rollkit.aggregator true --rollkit.da_layer celestia --rollkit.da_config='{"base_url":"http://'${LIGHT_NODE_IP}':26659","timeout":60000000000,"gas_limit":6000000,"fee":6000}' --rollkit.namespace_id $NAMESPACE_ID --rollkit.da_start_height $DA_BLOCK_HEIGHT
Restart=on-failure
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF

# start service
sudo systemctl daemon-reload
sudo systemctl enable ethermint-rollkitd
sudo systemctl restart ethermint-rollkitd
# show log
journalctl -fu ethermint-rollkitd -o cat
