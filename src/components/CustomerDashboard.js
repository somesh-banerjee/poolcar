import React, { useState,useEffect } from "react";
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { v4 as uuidV4 } from "uuid";
import { Button, Radio, Item, Form } from "semantic-ui-react";

import {
  contractAddress
} from './../web3/config'


import ABI from "./../web3/abi.json"

function App() {
    const [rides,setRides] = useState([])
    const [key,setKey] = useState()
    const [fee,setFee] = useState()
    const [reply,setReply] = useState()
    const [src,setSrc] = useState()
    const [dst,setDst] = useState()

    useEffect(()=>{
      const fetchRides = async() => {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        const Contract = new ethers.Contract(contractAddress, ABI, provider)
        let tx
        try {
          tx = await Contract.availableRides()
          console.log(rides)
  
        } catch (er) {
          console.log(er)
        }
        let arr = []
        tx.forEach(e => {
          if(e.customer === address){
            arr.push(e)
          }
        });
        setRides(arr)
      }
      fetchRides()
    },[])

    const proposeYourFee = async(e) => {
      e.preventDefault()
      if(reply === null )
        return
      console.log(key)
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      const Contract = new ethers.Contract(contractAddress, ABI, signer)
      try {
        let tx = await Contract.replyToProposeal(key,reply)
        console.log(tx)
      } catch (er) {
        console.log(er)
      }
    }

    const submit = async(e) => {
      e.preventDefault()
      if(src === null || dst === null)
        return
        
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      const Contract = new ethers.Contract(contractAddress, ABI, signer)
      const tmpkey = uuidV4()
      try {
        let tx = await Contract.newRide(tmpkey,src,dst)
        console.log(tx)
      } catch (er) {
        console.log(er)
      }
    }

    const paying = async(e) => {
      e.preventDefault()
      if(fee === undefined || key=== undefined) return
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      const Contract = new ethers.Contract(contractAddress, ABI, signer)
      //const val = ethers.utils.parseUnits(fee.toString(), "wei");
      try {
        let tx = await Contract.payment(key,{ value: fee})
        console.log(tx)
      } catch (er) {
        console.log(er)
      }
    }

    return (
      <div className="customer-dashboard">
        <Form>
          <Form.Field>
            <label>Source</label>
            <input placeholder='Source' onChange={(e) => setSrc(e.target.value)} />
          </Form.Field>
          <Form.Field>
            <label>Destination</label>
            <input placeholder='Destination' onChange={(e) => setDst(e.target.value)} />
          </Form.Field>
          <Button type='submit' onClick={submit}>New Ride</Button>
        </Form>
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
                    }
                  </Item.Extra>
                </Item.Content>
                <Radio label='Approve' onClick={(e)=>setReply(true)} />
                <Radio label='Not Approve' onClick={(e)=>setReply(false)} />
                <Button onClick={(e)=>{
                  setKey(i.key)
                  proposeYourFee(e)
                }}>Reply</Button>
                <Button onClick={(e)=>{
                  setKey(i.key)
                  setFee(i.fee)
                  paying(e)
                }}>Pay</Button>
              </Item>
            ))
          ) : "No Available Rides"
        }
        </Item.Group>
      </div>
    );
  }
  
  export default App;
  