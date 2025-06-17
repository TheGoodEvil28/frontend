import React from 'react';
import InvoiceForm from './InvoiceForm';
import Dashboard from './Dashboard';
import Withdraw from './Withdraw';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileInvoiceDollar, 
  faChartLine, 
  faMoneyBillTransfer,
  faWallet,
  faCoins
} from '@fortawesome/free-solid-svg-icons';

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
      padding: '2rem',
    }}>
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        color: 'white',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          <FontAwesomeIcon icon={faCoins} />
        </div>
        <h1 style={{
          fontSize: '2.5rem',
          margin: 0,
          marginBottom: '1rem',
          fontWeight: '700',
        }}>
          Simulasi Pembayaran Freelancer
        </h1>
        <p style={{
          fontSize: '1.2rem',
          margin: 0,
          opacity: 0.9,
        }}>
          USDT Dummy Payment System
        </p>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
      }}>
        {/* Invoice Section */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}>
          <h2 style={{
            color: '#2c3e50',
            marginBottom: '1.5rem',
            fontSize: '1.5rem',
            borderBottom: '2px solid #3498db',
            paddingBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <FontAwesomeIcon icon={faFileInvoiceDollar} style={{ color: '#3498db' }} />
            Create Invoice
          </h2>
          <InvoiceForm />
        </div>

        {/* Dashboard Section */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}>
          <h2 style={{
            color: '#2c3e50',
            marginBottom: '1.5rem',
            fontSize: '1.5rem',
            borderBottom: '2px solid #3498db',
            paddingBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <FontAwesomeIcon icon={faChartLine} style={{ color: '#3498db' }} />
            Invoice Dashboard
          </h2>
          <Dashboard />
        </div>

        {/* Withdraw Section */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}>
          <h2 style={{
            color: '#2c3e50',
            marginBottom: '1.5rem',
            fontSize: '1.5rem',
            borderBottom: '2px solid #e74c3c',
            paddingBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <FontAwesomeIcon icon={faMoneyBillTransfer} style={{ color: '#e74c3c' }} />
            Withdraw USDT
          </h2>
          <Withdraw />
        </div>
      </div>
    </div>
  );
}

export default App;
