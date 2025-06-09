
import React from 'react';
import InvoiceForm from './InvoiceForm';
import Dashboard from './Dashboard';
import Withdraw from './Withdraw';

function App() {
  return (
    <div style={{ margin: '2rem' }}>
      <h1>Simulasi Pembayaran Freelancer (USDT Dummy)</h1>
      <InvoiceForm />
      <Dashboard />
      <Withdraw />
    </div>
  );
}

export default App;
