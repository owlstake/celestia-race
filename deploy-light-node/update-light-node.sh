#!/bin/bash
# Install golang
ver="1.20.3" 
cd $HOME 
wget "https://golang.org/dl/go$ver.linux-amd64.tar.gz" 
sudo rm -rf /usr/local/go 
sudo tar -C /usr/local -xzf "go$ver.linux-amd64.tar.gz" 
rm "go$ver.linux-amd64.tar.gz"
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> $HOME/.bash_profile
source $HOME/.bash_profile
go version
echo "Install golang finished"
# Stop the node
sudo systemctl stop celestia-lightd
# Pull the latest tag
cd $HOME/celestia-node
git fetch --tags
git checkout v0.9.4
# Build and run
make build
sudo make install
celestia light config-update --p2p.network blockspacerace
sudo systemctl start celestia-lightd
# Show the logs
journalctl -fu celestia-lightd -o cat