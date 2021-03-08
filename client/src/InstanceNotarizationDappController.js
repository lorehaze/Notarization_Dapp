import {useState} from "react";
import Web3 from "web3";
import NotarizationDappControllerJson from "./contracts/NotarizationDappController.json";

let web3 = new Web3(window.web3.currentProvider);

export const InstanceNotarizationDappController = () => {
    const [NotarizationDappController, setNotarizationDappCtrl] = useState();
    
    const getNotarizationDappCtrl = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = NotarizationDappControllerJson.networks[networkId];
        setNotarizationDappCtrl(new web3.eth.Contract(NotarizationDappControllerJson.abi, deployedNetwork && deployedNetwork.address))
    }

    return [NotarizationDappController, setNotarizationDappCtrl, getNotarizationDappCtrl];
}


export default InstanceNotarizationDappController;