import React from "react";
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { Button } from "semantic-ui-react";

import {
    contractAddress
} from './../web3/config'


import ABI from "./../web3/abi.json"

function App() {

    const register = async() => {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const Contract = new ethers.Contract(contractAddress, ABI, signer)
        const val = ethers.utils.parseUnits("0.01", "ether");
        try {
            let tx = await Contract.newDriver({ value: val })
            console.log(tx)
        } catch (er) {
            console.log(er)
        }
    }

    return (
        <Button animated='fade' onClick={register}>
            <Button.Content visible>Register as driver</Button.Content>
            <Button.Content hidden>0.01 ETH per account</Button.Content>
        </Button>
    );
}

export default App;
