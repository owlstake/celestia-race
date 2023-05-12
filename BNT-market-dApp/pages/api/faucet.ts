import { exec } from 'child_process';
import { NextApiRequest, NextApiResponse } from 'next';
import { RPC_URLS } from '../../const/contractAddresses';

let globalNonce: any = null

function executeCastSendCoin(receiveAddress: string, nonce: number) {
    if (!receiveAddress || (!nonce && nonce !== 0)) {
        throw Error('receive fund address and nonce is required')
    }
    return new Promise((resolve, reject) => {
        const receiveNumCoins = "10ether";
        const cmd = `cast send ${receiveAddress} --value ${receiveNumCoins} --rpc-url ${RPC_URLS[0]} --private-key ${process.env.PRIVATE_KEY} --nonce ${nonce}`;
        exec(cmd, (error, stdout, stderr) => {
            if (error) {               
                console.error(`exec error: ${error}`);
                reject(error)                
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            resolve(1)          
        });
    })
}

export default async function faucet(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }
    const { address } = req.body   
    // De-construct body from request
  
    if (!address) {
        return res.status(400).json({ error: 'Invalid address' })
    }

    try {
        if (globalNonce === null) {
            exec(`cast nonce ${process.env.FUND_ADDRESS}`, async (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    res.status(500).json({
                        error: "Error cast nonce"
                    });
                    return;
                }               
                const nonce = Number(stdout.trim());
                globalNonce = nonce                
                try {
                    console.log("nonce: " + nonce);
                    await executeCastSendCoin(address, globalNonce);
                    globalNonce++
                    return res.json({
                        message: "Transaction successfully"
                    });
                } catch(err) {
                    globalNonce = null
                    return res.status(500).json({
                        error: "Error transaction"
                    });
                }
            });
        } else {
            console.log("nonce: " + globalNonce);            
            await executeCastSendCoin(address, globalNonce);
            globalNonce++
            return res.json({
                message: "Transaction successfully"
            });
        }       
    } catch (error: any) {       
        console.error(`exec error: ${error}`);
        globalNonce = null
        const message = error.stderr || error.message || "Error transaction";
        return res.status(500).json({
            error: message
        });
    }
}
