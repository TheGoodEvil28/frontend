import React, { useState } from 'react';
import { ethers } from "ethers";
import DummyUSDT_ABI from './DummyUSDT_ABI.json';

const CONTRACT_ADDRESS = "0x9052d8a3c6851Ed20FB19C6AFB863997877d9bE6";

const Withdraw = () => {
  const [freelancer, setFreelancer] = useState('');
  const [wallet, setWallet] = useState('');
  const [amount, setAmount] = useState('');

  const handleWithdraw = async () => {
    // 🔥 1. Simpan request withdraw ke backend (opsional)
    await fetch('http://localhost:5000/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ freelancer, wallet, amount }),
    });

    // 🔥 2. Kirim USDT Dummy dari wallet (Mint/Owner) ke wallet tujuan
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(CONTRACT_ADDRESS, DummyUSDT_ABI, signer);

    const amountWei = ethers.parseUnits(amount, 18); // amount (dalam USDT)
    const tx = await contract.transfer(wallet, amountWei);
    console.log("Withdraw tx:", tx);
    await tx.wait();
    alert("Withdraw success!");

    setFreelancer('');
    setWallet('');
    setAmount('');
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Withdraw USDT</h3>
      <input placeholder="Freelancer Name" value={freelancer} onChange={e => setFreelancer(e.target.value)} /><br/>
      <input placeholder="Wallet Address" value={wallet} onChange={e => setWallet(e.target.value)} /><br/>
      <input placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} /><br/>
      <button onClick={handleWithdraw}>Withdraw</button>
    </div>
  );
};

export default Withdraw;
