# This is Web service API to generate your own namespace_id and data values
Here is my demo:

***https://celestia-pfb.owlstake.com***

Our light node:

***https://tiascan.com/light-node/12D3KooWCdo1Ebe1k3HN9PHEma8DN1xqZGAgtpzeKWGoZtKfMpUq***

### Clone my repo
```
cd $HOME
git clone https://github.com/owlstake/celestia-race
```


# The Main WEB UI

### Install nodejs
```
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install nodejs -y
```
### Move to webui folder
```
cd $HOME/celestia-race/BNT-web-UI-PFB/web-ui
```
### you need to change the var in the .env file
```
cp env.example .env
nano .env
```
### install and start web ui
```
npm install
npm start
```
