# This is Web service API to generate your own namespace_id and data values

### Update system and install golang
```
sudo apt update && sudo apt upgrade -y
sudo apt install curl tar wget clang pkg-config libssl-dev jq build-essential git make ncdu -y
ver="1.19.1" 
cd $HOME 
wget "https://golang.org/dl/go$ver.linux-amd64.tar.gz" 
sudo rm -rf /usr/local/go 
sudo tar -C /usr/local -xzf "go$ver.linux-amd64.tar.gz" 
rm "go$ver.linux-amd64.tar.gz"
```

### Clone my repo
```
cd $HOME
git clone https://github.com/owlstake/celestia-race
```

### Test the web service:
```
go run $HOME/celestia-race/BNT-web-UI-PFB/random-number-go-web/go-web-api.go
```

#### Result
```
Server started on localhost:8080
```

#### Install this web service running as systemd
```
sudo tee <<EOF >/dev/null /etc/systemd/system/go-web-apid.service
[Unit]
Description=Go web API random nID and data
After=network-online.target

[Service]
User=$USER
ExecStart=$(which go) run $HOME/celestia-race/BNT-web-UI-PFB/random-number-go-web/go-web-api.go
Restart=always

[Install]
WantedBy=multi-user.target
EOF
```

#### Reload systemd, enable and start the service
```
sudo systemctl daemon-reload
sudo systemctl enable go-web-apid
sudo systemctl start go-web-apid
```

#### How to access the API

```
Open web browser and fill with http://<IP-web-server>:8080
```

#### Result

```
{
  "My seed value": 13298,
  "My hex-encoded namespace ID": "069635b8fca9fcad",
  "My hex-encoded message": "36a4a07cedbe1a2cf71f09fd8069927130c53dcb"
}
```
# The Main WEB UI

### Install nodejs
```
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install nodejs -y

```
