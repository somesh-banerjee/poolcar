import React, { useState,useEffect } from "react";
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { Button } from "semantic-ui-react";

import {
  contractAddress
} from './../web3/config'


import ABI from "./../web3/abi.json"

function App() {
    const [address,setAddress] = useState()
    const [rides,setRides] = useState([])
    
    const getRPC = async() => {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      return provider
    }

    useEffect(()=>{
      const fetchRides = async() => {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        //const provider = getRPC()
        const signer = provider.getSigner()
        setAddress(await signer.getAddress())
        const Contract = new ethers.Contract(contractAddress, ABI, provider)
        try {
          let tx = await Contract.availableRides()
          setRides(tx)
          console.log(rides)
  
        } catch (er) {
          console.log(er)
        }
      }
      fetchRides()
    },[])

    return (
      <div className="driver-dashboard">
        
      </div>
    );
  }
  
  export default App;
  