const axios = require('axios');
const express = require('express');
const path = require("path")

require('dotenv').config()

const app = express();

const app_domain = process.env.APP_DOMAIN;
const random_api = process.env.RANDOM_API;
const app_api = process.env.APP_API
const publicDir = path.join(__dirname, './public')

app.use(express.static(publicDir))
app.use(express.urlencoded({extended: 'false'}))
app.use(express.json());

app.set('view engine', 'hbs')

app.post("/submit_pfb", (req, res) => {
    const { namespace_id, data, gas_limit, fee } = req.body;
    console.log('namespace_id: ', namespace_id);
    console.log('data: ', data);
    console.log('gas_limit: ', gas_limit);
    console.log('fee: ', fee); 
    res.status(200).json({ message: 'Success' })    
})

app.get('/generate', async (req, res) => {
    try {       
        const response = await axios.get(
            random_api,            
            { timeout: 30000 }
        )
        return res.status(200).json(response.data)
    } catch (err) {
        return res.status(500).json({ message: 'Error' })
    }
})

app.get("/", (req, res) => {      
    res.render("index", { app_domain })
})

app.post("/", async (req, res) => {
	const { data_hash, namespace_id, gas_limit, fee, api_url } = req.body;
   try {
	   // const { data_hash, namespace_id, gas_limit, fee, api_url } = req.body;   
    let requestUrl = `${app_api}/submit_pfb`;

    if (!data_hash || !namespace_id) {
        return res.render('index', { error_message: 'data_hash and namespace_id is required', app_domain })
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
    return res.render('index', { message: JSON.stringify(response.data), app_domain, namespace_id, data_hash, gas_limit, fee, api_url })
   } catch (err) {
    return res.render('index', { error_message: 'Exception error', app_domain, namespace_id, data_hash, gas_limit, fee, api_url })
   }   
})

app.listen(5000, () => {
    console.log("server started on port 5000")
})
