# Part 1: [Deploy Ethermint rollup](https://github.com/owlstake/celestia-race/tree/main/BNT-deploy-ethermint-rollup) (See below guide)
# Part 2: [Deploy NFT marketplace dApp](https://github.com/owlstake/celestia-race/tree/main/BNT-market-dApp)

1. Deploy light-node automatically
```
wget -O auto-install-light-node.sh https://raw.githubusercontent.com/owlstake/celestia-race/main/deploy-light-node/auto-install-light-node.sh && chmod +x auto-install-light-node.sh && ./auto-install-light-node.sh
```
2. Request faucet funding in Celestia's [Discord](https://discord.com/channels/638338779505229824/1077531922022015026)

3. Deploy ethermint rollup automatically
```
wget -O deploy-ethermintd.sh https://raw.githubusercontent.com/owlstake/celestia-race/main/BNT-deploy-ethermint-rollup/deploy-ethermintd.sh && chmod +x deploy-ethermintd.sh && ./deploy-ethermintd.sh
```
We have kickstarted our ***ethermintd*** network

4. Show Private key
```
ethermintd keys unsafe-export-eth-key mykey --keyring-backend test
```
If you see this error in your logs, it means that your Light node address has not been funded yet
```
ERR DA layer submission failed error="rpc error: code = NotFound desc = account celestia1jxxxxxxxxx not found" attempt=1 module=BlockManager
```

# Bonus:

Deploy ethermint rollup mannually with details:

### Change your light node IP address
```
echo "export LIGHT_NODE_IP=localhost" >> $HOME/.bash_profile
```
### Update system
```
sudo apt update && sudo apt upgrade -y
sudo apt install curl build-essential git wget jq make gcc ack tmux ncdu -y
sudo wget -qO /usr/local/bin/yq https://github.com/mikefarah/yq/releases/download/v4.27.3/yq_linux_amd64 && chmod +x /usr/local/bin/yq
```
### Install nodejs
```
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install nodejs -y
source ~/.bashrc
node -v
```
### Install foundry
### If you do not want to use the redirect, feel free to manually download the foundryup installation script from here.
```
curl -L https://foundry.paradigm.xyz | bash
```
### Then, run foundryup in a new terminal session or after reloading your PATH.
```
source /root/.bashrc
```
### Other ways to use foundryup, and other documentations can be found here. Happy forging!
```
foundryup
```
### Install ethermint
```
cd ~
git clone https://github.com/celestiaorg/ethermint.git
cd ethermint
make install
```
### In the ethermint directory, we have a helpful bash script that allows you to instantiate a local Ethermint sovereign rollup on Celestia.
```
wget -O init-ethermintd-555555.sh https://raw.githubusercontent.com/owlstake/celestia-race/main/BNT-deploy-ethermint-rollup/init-ethermintd-555555.sh
chmod +x init-ethermintd-555555.sh
bash init-ethermintd-555555.sh
echo "export NAMESPACE_ID=$(echo $RANDOM | md5sum | head -c 16; echo;)" >> $HOME/.bash_profile
echo "export DA_BLOCK_HEIGHT=$(curl https://rpc-blockspacerace.pops.one/block | jq -r '.result.block.header.height')" >> $HOME/.bash_profile
source $HOME/.bash_profile
source /root/.bashrc
```
### Create service
```
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
```
### Start service
```
sudo systemctl daemon-reload
sudo systemctl enable ethermint-rollkitd
sudo systemctl restart ethermint-rollkitd
```
### Show logs
```
journalctl -fu ethermint-rollkitd -o cat
```
