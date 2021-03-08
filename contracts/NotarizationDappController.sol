pragma solidity ^0.6.2;

contract NotarizationDappController {

    struct DocStorage {
        uint256 totalDocStored;
        string[] docsHash;
    }

    mapping(address => DocStorage) DocsMapping;

    DocStorage newDocStorage;

    function storageDoc(string memory _docHash) public {
        newDocStorage.docsHash.push(_docHash);
        newDocStorage.totalDocStored++;
        DocsMapping[msg.sender] = newDocStorage;    //inseriamo i dati della struct nello storage utilizzando come chiave l'indirizzo del sender
    }

    function getDocStored(uint256 _index) public view returns(string memory){
        return DocsMapping[msg.sender].docsHash[_index];    //recuperiamo file nell'array assegnato a determinato indice
    }

    function getTotalDocStored() public view returns(uint256) {
        return DocsMapping[msg.sender].totalDocStored;
    }
}

