import React, { useState } from 'react';
import Web3 from 'web3';

const ConnectionProvider = () => {
    const [account, setAccount] = useState();
    const web3 = new Web3(window.web3.currentProvider);

    const autorizeApp = async () => {           //controlliamo se nella finestra del browser è presente il parametro ethereum
        if (window.ethereum) {
            window.ethereum.autoRefreshOnNetworkChange = true;
            window.web3 = new Web3(window.ethereum);        //settiamo quindi la variabile web3

        try {
            await window.ethereum.enable();
            let listAccounts = await web3.eth.getAccounts();    //assegnamo la variabile account al parametro ritornato da getAccounts
            setAccount(listAccounts[0]);
        } 
        catch (error) {
            console.log("Errore nel caricamento dell'istanza "+ error);
            }   

        }
        else if (window.web3) {
            window.web3 = new Web3(web3.currentProvider);   //se è già presente la variabile web3, la risettiamo con il current provider
        }
        else { console.log("Provider non trovato. Effettua il download di Metamask!"); }
    }
    return [account, setAccount, autorizeApp];  //ritorniamo variabile, metodo di setting e funzione da richiamare in main components APp.js
}

export default ConnectionProvider;