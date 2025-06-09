import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import DummyUSDT_ABI from './DummyUSDT_ABI.json';

const RPC_URL = 'https://sepolia.infura.io/v3/1b75d0eff5174eb896cd2333d0d529d6';
const CONTRACT_ADDRESS = '0x9052d8a3c6851Ed20FB19C6AFB863997877d9bE6';

const Dashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchData();
    fetchTransactions();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:3000/invoices');
      setInvoices(res.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const payInvoice = async (id) => {
    try {
      await axios.post('http://localhost:3000/pay', { id });
      alert('Invoice paid!');
      fetchData();
    } catch (error) {
      console.error('Error paying invoice:', error);
    }
  };

const fetchTransactions = async () => {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, DummyUSDT_ABI, provider);

    const filter = contract.filters.Transfer();
    const logs = await contract.queryFilter(filter, 0, 'latest');
    console.log('Logs:', logs);

    const formatted = logs.map((log) => ({
      hash: log.transactionHash,
      from: log.args.from,
      to: log.args.to,
      amount: ethers.formatUnits(log.args.value, 18),
      blockNumber: log.blockNumber,
    }));

    // Ambil 3 transaksi terbaru aja
    setTransactions(formatted.reverse().slice(0, 3));
  } catch (error) {
    console.error('Error fetching transactions:', error);
  }
};

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Daftar Invoice</h3>
      {invoices.map((inv) => (
        <div
          key={inv.id}
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            marginBottom: '1rem',
            padding: '1rem',
          }}
        >
          <p><b>Freelancer:</b> {inv.freelancer}</p>
          <p><b>Amount:</b> {inv.amount} USDT</p>
          <p><b>Status:</b> {inv.status}</p>
          {inv.status === 'pending' && (
            <button onClick={() => payInvoice(inv.id)}>Bayar</button>
          )}
        </div>
      ))}

      <h3>Riwayat Transaksi DummyUSDT</h3>
      {transactions.length === 0 && <p>Tidak ada transaksi tercatat.</p>}
      {transactions.map((tx, idx) => (
        <div
          key={idx}
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            marginBottom: '1rem',
            padding: '1rem',
            background: '#f9f9f9',
          }}
        >
          <p><b>Tx Hash:</b> {tx.hash}</p>
          <p><b>From:</b> {tx.from}</p>
          <p><b>To:</b> {tx.to}</p>
          <p><b>Amount:</b> {tx.amount} DUSDT</p>
          <p><b>Block:</b> {tx.blockNumber}</p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
