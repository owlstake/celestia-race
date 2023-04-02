#!/usr/bin/env bash

echo -e "\e[1m\e[32mInstalling Prometheus... \e[0m" && sleep 1

# install prometheus
wget https://github.com/prometheus/prometheus/releases/download/v2.34.0/prometheus-2.34.0.linux-amd64.tar.gz
tar xvfz prometheus-*.*-amd64.tar.gz
sudo mv prometheus-*.*-amd64 prometheus
rm prometheus-* -rf

# create systemd service
sudo tee <<EOF >/dev/null /etc/systemd/system/prometheus.service
[Unit]
Description=Prometheus
After=network-online.target

[Service]
User=$USER
ExecStart=$HOME/prometheus/prometheus --config.file=$HOME/prometheus/prometheus.yml
Restart=always
RestartSec=3
LimitNOFILE=4096

[Install]
WantedBy=multi-user.target
EOF

# start systemd service
sudo systemctl daemon-reload
sudo systemctl enable prometheus

echo -e "\e[1m\e[32mInstallation finished... \e[0m" && sleep 1
echo -e "\e[1m\e[32mPlease update Prometheus config file to add Node Exporter and Cosmos Exporter \e[0m" && sleep 1
