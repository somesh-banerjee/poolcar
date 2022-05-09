import React, { useState,useEffect } from "react";
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { Button, Input, Item } from "semantic-ui-react";

import {
  contractAddress
} from './../web3/config'


import ABI from "./../web3/abi.json"

function App() {
    const [address,setAddress] = useState()
    const [rides,setRides] = useState([])
    const [fee,setFee] = useState()
    const [key,setKey] = useState()

    useEffect(()=>{
      const fetchRides = async() => {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
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

    const proposeYourFee = async(e) => {
      e.preventDefault()
      console.log(key)
      console.log(fee)
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      const Contract = new ethers.Contract(contractAddress, ABI, signer)
      const val = ethers.utils.parseUnits(fee.toString(), "ether")
      try {
        let tx = await Contract.proposeRide(key,val)
        console.log(tx)
      } catch (er) {
        console.log(er)
      }
    }

    return (
      <div className="driver-dashboard">
        <Item.Group divided>
        {
          rides.length>0 ? (
            rides.map(i=>(
              <Item key={i._id}>
                <Item.Content>
                  <Item.Header as='a'>{`${i.source} => ${i.destination}`}</Item.Header>
                  <Item.Meta>{`Customer: ${i.customer}`}</Item.Meta>
                  <Item.Extra>
                    {
                      i.driver === "0x0000000000000000000000000000000000000000" ? "No driver has proposed" : `${i.driver} has proposed`
                    }<br/>{
                      i.proposalStatus === false ? "Proposal is not yet accepted" : "Proposal is accepted"
                    }
                  </Item.Extra>
                </Item.Content>
                <Input focus placeholder='Your Fee in ETH' onChange={(e) => setFee(e.target.value)}></Input>
                <Button onClick={(e)=>{
                  setKey(i.key)
                  proposeYourFee(e)
                }}>Propose</Button>
              </Item>
            ))
          ) : "No Available Rides"
        }
        </Item.Group>
      </div>
    );
  }
  
  export default App;
  