import React, { useState } from 'react';
import { ethers } from "ethers";
import DummyUSDT_ABI from './DummyUSDT_ABI.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faWallet, 
  faMoneyBill,
  faMoneyBillTransfer
} from '@fortawesome/free-solid-svg-icons';

const CONTRACT_ADDRESS = "0x9052d8a3c6851Ed20FB19C6AFB863997877d9bE6";

const Withdraw = () => {
  const [freelancer, setFreelancer] = useState('');
  const [wallet, setWallet] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleWithdraw = async () => {
    try {
      setIsLoading(true);
      // Save withdrawal request to backend
      await fetch('http://localhost:5000/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ freelancer, wallet, amount }),
      });

      // Process blockchain withdrawal
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, DummyUSDT_ABI, signer);

      const amountWei = ethers.parseUnits(amount, 18);
      const tx = await contract.transfer(wallet, amountWei);
      await tx.wait();
      
      alert("Withdrawal successful!");
      setFreelancer('');
      setWallet('');
      setAmount('');
    } catch (error) {
      alert("Error processing withdrawal: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '1rem',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    outline: 'none',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    opacity: isLoading ? 0.7 : 1,
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem',
          color: '#34495e',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <FontAwesomeIcon icon={faUser} style={{ color: '#e74c3c' }} />
          Freelancer Name
        </label>
        <input
          style={inputStyle}
          placeholder="Enter freelancer name"
          value={freelancer}
          onChange={e => setFreelancer(e.target.value)}
          onFocus={e => e.target.style.borderColor = '#e74c3c'}
          onBlur={e => e.target.style.borderColor = '#e0e0e0'}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem',
          color: '#34495e',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <FontAwesomeIcon icon={faWallet} style={{ color: '#e74c3c' }} />
          Wallet Address
        </label>
        <input
          style={inputStyle}
          placeholder="Enter recipient wallet address"
          value={wallet}
          onChange={e => setWallet(e.target.value)}
          onFocus={e => e.target.style.borderColor = '#e74c3c'}
          onBlur={e => e.target.style.borderColor = '#e0e0e0'}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem',
          color: '#34495e',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <FontAwesomeIcon icon={faMoneyBill} style={{ color: '#e74c3c' }} />
          Amount (USDT)
        </label>
        <input
          style={inputStyle}
          type="number"
          placeholder="Enter amount to withdraw"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          onFocus={e => e.target.style.borderColor = '#e74c3c'}
          onBlur={e => e.target.style.borderColor = '#e0e0e0'}
        />
      </div>

      <button
        style={buttonStyle}
        onClick={handleWithdraw}
        disabled={isLoading}
        onMouseOver={e => !isLoading && (e.target.style.background = 'linear-gradient(135deg, #c0392b 0%, #a93226 100%)')}
        onMouseOut={e => !isLoading && (e.target.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)')}
      >
        <FontAwesomeIcon icon={faMoneyBillTransfer} style={{ marginRight: '0.5rem' }} />
        {isLoading ? 'Processing Withdrawal...' : 'Withdraw USDT'}
      </button>
    </div>
  );
};

export default Withdraw;
