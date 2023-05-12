import { toast } from "react-hot-toast";
import { ADD_NETWORK_CONFIG, CHAIN_ID } from "../const/contractAddresses";
import toastStyle from "../util/toastConfig";
import { useSwitchChain } from "@thirdweb-dev/react";

export default function useSwitchNetwork() {
    const switchChain = useSwitchChain()

    const handleAddNetwork = async () => {
        try {
            await (window as any).ethereum.request({
                method: "wallet_addEthereumChain",
                params: [ADD_NETWORK_CONFIG],
            });
            return true     
        } catch (err: any) {
            console.error(err)
            toast(err?.message || '', {
                icon: "❌",
                style: toastStyle,
                position: "bottom-center",
            });
            return false       
        }        
    }

    const handleSwitchNetwork = async ():Promise<boolean> => {
        if ((window as any).ethereum?.networkVersion !== CHAIN_ID) {  
          try { 
            await switchChain(CHAIN_ID)
            return true
          } catch (err: any) {
            if (err.name !== 'ChainNotConfigured') {
              toast(err?.message || '', {
                icon: "❌",
                style: toastStyle,
                position: "bottom-center",
              });
              return false;
            }        
          }
          const isAddedNetwork = await handleAddNetwork()
          if (!isAddedNetwork) return false;
          try {
            await switchChain(CHAIN_ID)
            return true
          } catch (err: any) {
            toast(err?.message || '', {
              icon: "❌",
              style: toastStyle,
              position: "bottom-center",
            });
            return false
          } 
        }
        return true
      }

    return handleSwitchNetwork
}