import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import DummyUSDT_ABI from './DummyUSDT_ABI.json';

const RPC_URL = 'https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID'; // ganti dengan Infura (atau Alchemy) URL kamu
const CONTRACT_ADDRESS = '0x9052d8a3c6851Ed20FB19C6AFB863997877d9bE6';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, DummyUSDT_ABI, provider);

      // Filter event Transfer
      const filter = contract.filters.Transfer();
      const logs = await contract.queryFilter(filter, -5000); // 5000 block terakhir

      // Format data
      const formatted = logs.map((log) => ({
        hash: log.transactionHash,
        from: log.args.from,
        to: log.args.to,
        amount: ethers.formatUnits(log.args.value, 18),
        blockNumber: log.blockNumber,
      }));

      // Urutkan dari yang terbaru
      setTransactions(formatted.reverse());
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Riwayat Transaksi DummyUSDT</h3>
      {transactions.map((tx, idx) => (
        <div key={idx} style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          marginBottom: '1rem',
          padding: '1rem',
          background: '#f9f9f9'
        }}>
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

export default TransactionHistory;
