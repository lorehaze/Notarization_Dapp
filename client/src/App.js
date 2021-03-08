import React, { Component, useEffect, useState } from "react";
import ConnectionProvider from "./ConnectionProvider";
import InstanceNotarizationDappController from "./InstanceNotarizationDappController";
import "./App.css";
import {CgFileDocument} from "react-icons/cg";

const ipfsClient = require("ipfs-api");
const ipfs = ipfsClient({host:"ipfs.infura.io",port:5001, protocol:"https"});

const App = () => {

  const [NotarizationDappController, setNotarizationDappCtrl, getNotarizationDappCtrl] = InstanceNotarizationDappController();
  const [account, setAccount, autorizeApp] = ConnectionProvider();
  const [docHash, setDocHash] = useState(); //contain the hash to insert into blockchain
  const [loading, setLoading] = useState(); //set loading message while uploading
  const [listDocHash, setListDocHash] = useState([]); //variabile di stato che contiene lista documenti dalla blockchain


  useEffect(() => {
    autorizeApp();
    getNotarizationDappCtrl();
  })

  const getInstance = async () => {
    console.log(NotarizationDappController);
  }

  //smart contract functions

  const fileUploading = event => {
    let file = event.target.files[0];   //prendo file all'interno del target evento e array files
    const reader = new  FileReader(); //settiamo reader che permette di leggere il file
    reader.readAsArrayBuffer(file); 
    reader.onloadend = () => {
      setLoading("Caricamento del file in corso... Attendere...");
      ipfs.files.add(Buffer(reader.result),(err,result) => {
        if(err) {
          setLoading("Il caricamento del file non è andato a buon fine!" + JSON.stringify(err));
        }
        console.log(result);
        setDocHash(result[0].hash);
        setLoading("Il caricamento è stato eseguito con successo, procedere con l'invio della transazione!");
      })
    }
  }

  const settingDocHash = async () => {
    let listHashDocs = await getDocStoredCount(); //riprendiamo lista documenti già notarizzati in blockchain
    listHashDocs.includes(docHash)? setLoading("Il documento è già stato notarizzato."); //se l'hash esiste, allora error
    await NotarizationDappController.methods.storageDoc(docHash).send({from:account}); //se la funzione non comporta il cambiamento di stato della blockchain, al posto di .send si usa .call
  }

  const getDocStoredCount = async () => {
    return await NotarizationDappController.methods.getTotalDocStored().call({from:account});
  }

  const getDocStored = async () => {  
    let docStoredCount = await getDocStoredCount(); //prendo count
    let docsHashStored = [];  //istanzio lista vuota

    for (let i=0; i<docStoredCount; i++) { //itera per il numero di doc storati
      docsHashStored.push(await NotarizationDappController.methods.getDocStored(i).call({from:account})); //pusha valore hash i-esimo elemento nella lista
    }
    setListDocHash(docsHashStored); //setto variabile di stato
    return docsHashStored;  //ritorno lista popolata
  }


  return (
    <div className="App">
     <h1> Notarization Dapp! </h1>
      <button onClick={getInstance}>Vediamo la nostra istanza</button>
      <input onChange={fileUploading} type="file"/>
      <button onClick={settingDocHash}>Invia Documento</button>
      <h3>{loading}</h3>

      <div>
        <button onClick={getDocStoredCount}>Visualizza documenti </button>
        {listDocHash.map((hash,key) => {
          return (
            <div key={key} style={{marginTop: "70px"}}>
            <CgFileDocument size={50}/>
            <h6>{hash}</h6>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App;
