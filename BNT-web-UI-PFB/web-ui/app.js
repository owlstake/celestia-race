const axios = require('axios');
const express = require('express');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const seedrandom = require('seedrandom');

require('dotenv').config()

const app = express();

const generateRd = () => {
    const seed = crypto.randomInt(1, 1000);
    const random = crypto.createHash('sha256').update(seed.toString()).digest('hex');
    const rand = parseInt(random.slice(0,16), 16);
    const rng = seedrandom(rand);

    // generate a random namespace ID
    const nID = crypto.randomBytes(8).toString('hex');

    // generate a random hex-encoded message
    const lenMsg = Math.floor(rng() * 100);
    const msg = crypto.randomBytes(lenMsg).toString('hex');

    return { namespace_id: nID, hex: msg }
}

const app_domain = process.env.APP_DOMAIN;
// const random_api = process.env.RANDOM_API;
const api_url_default = process.env.API_URL_DEFAULT

const publicDir = path.join(__dirname, './public')

app.use(express.static(publicDir))
app.use(cookieParser())
app.use(session({ secret: 'mysecret' }))
app.use(flash())
app.use(express.urlencoded({extended: 'false'}))
app.use(express.json());

app.set('view engine', 'hbs')

app.post('/submit_pfb', (req, res) => {
    const { namespace_id, data, gas_limit, fee } = req.body;
    console.log('namespace_id: ', namespace_id);
    console.log('data: ', data);
    console.log('gas_limit: ', gas_limit);
    console.log('fee: ', fee); 
    res.status(200).json({ message: 'Success' })    
})

app.get('/generate', async (req, res) => {
    try {       
        const rd = generateRd()
        return res.status(200).json(rd)
    } catch (err) {
        return res.status(500).json({ message: 'Error' })
    }
})

app.get('/', (req, res) => {
    let data = {}
    try {
        data = JSON.parse(req.flash('data') || {})
    } catch (err) {}
    
    res.render('index', { 
        app_domain, 
        height: data.height, 
        txhash: data.txhash,
        show_response: Boolean(data.height || data.txhash),
        show_response_retrieve: Boolean(data.r_res_height && data.r_res_shares),
        r_namespace_id: data.namespace_id || data.r_namespace_id,
        r_height: data.r_height || data.height,
        transaction_url: data.transaction_url,
        data_hash: data.data_hash, 
        namespace_id: data.namespace_id,
        gas_limit: data.gas_limit,
        fee: data.fee,
        api_url: data.api_url,
        error_message: req.flash('error_message'),
        r_res_height: data.r_res_height,
        r_res_shares: data.r_res_shares,
    })
})

app.post('/get-namespaced-shares', async function(req, res) {
    const { r_namespace_id, r_height } = req.body;

    if (!r_height || !r_namespace_id) {
        req.flash('error_message', 'height and namespace_id is required')
        return res.redirect('/')
    }

    try {        
        const response = await axios.get(`${api_url_default}/namespaced_shares/${r_namespace_id}/height/${r_height}`)

        req.flash('data', JSON.stringify({
            r_res_shares: response.data.shares, 
            r_res_height: response.data.height,
            r_namespace_id,
            r_height
        }))
        return res.redirect('/')
    } catch (err) {
        req.flash('error_message', 'Exception error')
        req.flash('data', JSON.stringify({
            r_namespace_id,
            r_height           
        }))      
        return res.redirect('/')
    }
})

app.post('/', async (req, res) => {   
	const { data_hash, namespace_id, gas_limit, fee, api_url } = req.body;
    try {
	   // const { data_hash, namespace_id, gas_limit, fee, api_url } = req.body;   
        let requestUrl = `${api_url_default}/submit_pfb`;

        if (!data_hash || !namespace_id) {
            req.flash('error_message', 'data_hash and namespace_id is required')
            return res.redirect('/')
        }

        if (api_url?.indexOf('https://') === 0 || api_url?.indexOf('http://') === 0) {
            requestUrl = api_url
        }
        const requestBody = {
            data: data_hash,
            namespace_id, 
            gas_limit: gas_limit || 80000, 
            fee: fee || 2000        
        }
        const response = await axios.post(
            requestUrl, 
            requestBody, 
            { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
        )

        const { height, txhash } = response.data;
        const transaction_url = txhash ? `https://testnet.mintscan.io/celestia-incentivized-testnet/txs/${txhash}` : '';        
        req.flash('data', JSON.stringify({
            height, 
            txhash, 
            transaction_url,            
            namespace_id, 
            data_hash, 
            gas_limit, 
            fee, 
            api_url
        }))
        return res.redirect('/')
    } catch (err) {
        req.flash('error_message', 'Exception error')
        req.flash('data', JSON.stringify({
            namespace_id, 
            data_hash, 
            gas_limit, 
            fee, 
            api_url            
        }))
        return res.redirect('/')
    }   
})

app.listen(5000, () => {
    console.log("server started on port 5000")
})
