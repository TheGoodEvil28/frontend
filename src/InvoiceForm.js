import React, { useState } from 'react';
import axios from 'axios';
import { ethers } from "ethers";
import DummyUSDT_ABI from './DummyUSDT_ABI.json';

const CONTRACT_ADDRESS = "0x9052d8a3c6851Ed20FB19C6AFB863997877d9bE6";


const InvoiceForm = () => {
  const [freelancer, setFreelancer] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = async () => {
    await axios.post('http://localhost:5000/invoice', { freelancer, amount, note });

    alert('Invoice created!');
    await handleMint();  // 🔥 Panggil mint blockchain
    setFreelancer('');
    setAmount('');
    setNote('');
  };

 const handleMint = async () => {
  console.log("handleMint called! 🚀");

  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.BrowserProvider(window.ethereum); // Fix: ethers v6 pakai BrowserProvider
  const signer = await provider.getSigner();

  const to = await signer.getAddress(); // Harus pakai await
  const amountWei = ethers.parseUnits(amount, 18); // ethers v6: parseUnits langsung
  const contract = new ethers.Contract(CONTRACT_ADDRESS, DummyUSDT_ABI, signer);

  const tx = await contract.mint(to, amountWei);
  console.log("Mint tx:", tx);
  await tx.wait();
  console.log("Mint success!");
};


  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Buat Invoice</h3>
      <input placeholder="Freelancer" value={freelancer} onChange={e => setFreelancer(e.target.value)} /><br/>
      <input placeholder="Amount (USDT)" value={amount} onChange={e => setAmount(e.target.value)} /><br/>
      <input placeholder="Note" value={note} onChange={e => setNote(e.target.value)} /><br/>
      <button onClick={handleSubmit}>Buat Invoice</button>
    </div>
  );
};

export default InvoiceForm;
