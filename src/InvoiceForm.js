import React, { useState } from 'react';
import axios from 'axios';
import { ethers } from "ethers";
import DummyUSDT_ABI from './DummyUSDT_ABI.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faMoneyBill, 
  faNoteSticky,
  faFileInvoiceDollar
} from '@fortawesome/free-solid-svg-icons';

const CONTRACT_ADDRESS = "0x9052d8a3c6851Ed20FB19C6AFB863997877d9bE6";

const InvoiceForm = () => {
  const [freelancer, setFreelancer] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await axios.post('http://localhost:5000/invoice', { freelancer, amount, note });
      await handleMint();
      alert('Invoice created successfully!');
      setFreelancer('');
      setAmount('');
      setNote('');
    } catch (error) {
      alert('Error creating invoice: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMint = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const to = await signer.getAddress();
    const amountWei = ethers.parseUnits(amount, 18);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, DummyUSDT_ABI, signer);

    const tx = await contract.mint(to, amountWei);
    await tx.wait();
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
    background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
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
          <FontAwesomeIcon icon={faUser} style={{ color: '#3498db' }} />
          Freelancer Name
        </label>
        <input
          style={inputStyle}
          placeholder="Enter freelancer name"
          value={freelancer}
          onChange={e => setFreelancer(e.target.value)}
          onFocus={e => e.target.style.borderColor = '#3498db'}
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
          <FontAwesomeIcon icon={faMoneyBill} style={{ color: '#2ecc71' }} />
          Amount (USDT)
        </label>
        <input
          style={inputStyle}
          type="number"
          placeholder="Enter amount in USDT"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          onFocus={e => e.target.style.borderColor = '#3498db'}
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
          <FontAwesomeIcon icon={faNoteSticky} style={{ color: '#f1c40f' }} />
          Note
        </label>
        <input
          style={inputStyle}
          placeholder="Add a note (optional)"
          value={note}
          onChange={e => setNote(e.target.value)}
          onFocus={e => e.target.style.borderColor = '#3498db'}
          onBlur={e => e.target.style.borderColor = '#e0e0e0'}
        />
      </div>

      <button
        style={buttonStyle}
        onClick={handleSubmit}
        disabled={isLoading}
        onMouseOver={e => !isLoading && (e.target.style.background = 'linear-gradient(135deg, #2980b9 0%, #2471a3 100%)')}
        onMouseOut={e => !isLoading && (e.target.style.background = 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)')}
      >
        <FontAwesomeIcon icon={faFileInvoiceDollar} style={{ marginRight: '0.5rem' }} />
        {isLoading ? 'Creating Invoice...' : 'Create Invoice'}
      </button>
    </div>
  );
};

export default InvoiceForm;
