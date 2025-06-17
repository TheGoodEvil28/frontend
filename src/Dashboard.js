import React, { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from "ethers";
import DummyUSDT_ABI from "./DummyUSDT_ABI.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faMoneyBill, 
  faClock, 
  faCheckCircle,
  faArrowRightArrowLeft,
  faCube,
  faWallet
} from '@fortawesome/free-solid-svg-icons';

const RPC_URL = "https://sepolia.infura.io/v3/1b75d0eff5174eb896cd2333d0d529d6";
const CONTRACT_ADDRESS = "0x9052d8a3c6851Ed20FB19C6AFB863997877d9bE6";

const Dashboard = () => {
    const [invoices, setInvoices] = useState([]);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchData();
        fetchTransactions();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:3000/invoices");
            setInvoices(res.data);
        } catch (error) {
            console.error("Error fetching invoices:", error);
        }
    };

    const payInvoice = async (id) => {
        try {
            await axios.post("http://localhost:3000/pay", { id });
            alert("Invoice paid!");
            fetchData();
        } catch (error) {
            console.error("Error paying invoice:", error);
        }
    };

    const fetchTransactions = async () => {
        try {
            const provider = new ethers.JsonRpcProvider(RPC_URL);
            const contract = new ethers.Contract(
                CONTRACT_ADDRESS,
                DummyUSDT_ABI,
                provider
            );

            const filter = contract.filters.Transfer();
            const logs = await contract.queryFilter(filter, 0, "latest");
            console.log("Logs:", logs);

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
            console.error("Error fetching transactions:", error);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: "2rem" }}>
                {" "}
                <div style={{ display: "grid", gap: "1rem" }}>
                    {invoices.map((inv) => (
                        <div
                            key={inv.id}
                            style={{
                                background: "white",
                                borderRadius: "8px",
                                padding: "1rem",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                                border: "1px solid #e0e0e0",
                                transition:
                                    "transform 0.2s ease, box-shadow 0.2s ease",
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(-2px)";
                                e.currentTarget.style.boxShadow =
                                    "0 4px 8px rgba(0, 0, 0, 0.1)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform =
                                    "translateY(0)";
                                e.currentTarget.style.boxShadow =
                                    "0 2px 4px rgba(0, 0, 0, 0.05)";
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <FontAwesomeIcon icon={faUser} style={{ color: '#3498db' }} />
                                    <h4 style={{ margin: 0, color: "#2c3e50" }}>
                                        {inv.freelancer}
                                    </h4>
                                </div>
                                <span
                                    style={{
                                        padding: "0.3rem 0.6rem",
                                        borderRadius: "12px",
                                        fontSize: "0.8rem",
                                        fontWeight: "500",
                                        background:
                                            inv.status === "pending"
                                                ? "#f1c40f"
                                                : "#2ecc71",
                                        color: "white",
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.3rem',
                                    }}
                                >
                                    {inv.status === "pending" ? (
                                        <FontAwesomeIcon icon={faClock} />
                                    ) : (
                                        <FontAwesomeIcon icon={faCheckCircle} />
                                    )}
                                    {inv.status}
                                </span>
                            </div>
                            <p
                                style={{
                                    fontSize: "1.1rem",
                                    marginBottom: "0.5rem",
                                    color: "#34495e",
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                }}
                            >
                                <FontAwesomeIcon icon={faMoneyBill} style={{ color: '#2ecc71' }} />
                                <strong>{inv.amount} USDT</strong>
                            </p>
                            {inv.status === "pending" && (
                                <button
                                    onClick={() => payInvoice(inv.id)}
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
                                        color: "white",
                                        border: "none",
                                        padding: "0.5rem 1rem",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontSize: "0.9rem",
                                        fontWeight: "500",
                                        transition: "all 0.3s ease",
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginLeft: 'auto',
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.background =
                                            "linear-gradient(135deg, #2980b9 0%, #2471a3 100%)";
                                        e.target.style.transform =
                                            "translateY(-1px)";
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.background =
                                            "linear-gradient(135deg, #3498db 0%, #2980b9 100%)";
                                        e.target.style.transform =
                                            "translateY(0)";
                                    }}
                                >
                                    <FontAwesomeIcon icon={faMoneyBill} />
                                    Pay Invoice
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 style={{ color: "#2c3e50", marginBottom: "1rem" }}>
                    Recent Transactions
                </h3>
                <div style={{ display: "grid", gap: "1rem" }}>
                    {transactions.length === 0 ? (
                        <p
                            style={{
                                textAlign: "center",
                                color: "#7f8c8d",
                                padding: "1rem",
                            }}
                        >
                            No transactions recorded.
                        </p>
                    ) : (
                        transactions.map((tx, idx) => (
                            <div
                                key={idx}
                                style={{
                                    background: "white",
                                    borderRadius: "8px",
                                    padding: "1rem",
                                    borderLeft: "4px solid #3498db",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    <span
                                        style={{
                                            color: "#7f8c8d",
                                            fontSize: "0.9rem",
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.3rem',
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faCube} />
                                        Block #{tx.blockNumber}
                                    </span>
                                    <span
                                        style={{
                                            color: "#2ecc71",
                                            fontWeight: "bold",
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.3rem',
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faMoneyBill} />
                                        {tx.amount} DUSDT
                                    </span>
                                </div>
                                <div style={{ marginBottom: "0.5rem" }}>
                                    <p
                                        style={{
                                            margin: "0.2rem 0",
                                            fontSize: "0.9rem",
                                            color: "#34495e",
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.3rem',
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faWallet} />
                                        <strong>From:</strong>{" "}
                                        {tx.from.slice(0, 6)}...
                                        {tx.from.slice(-4)}
                                    </p>
                                    <p
                                        style={{
                                            margin: "0.2rem 0",
                                            fontSize: "0.9rem",
                                            color: "#34495e",
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.3rem',
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faWallet} />
                                        <strong>To:</strong> {tx.to.slice(0, 6)}
                                        ...{tx.to.slice(-4)}
                                    </p>
                                </div>
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: "0.8rem",
                                        color: "#95a5a6",
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.3rem',
                                    }}
                                >
                                    <FontAwesomeIcon icon={faArrowRightArrowLeft} />
                                    Tx: {tx.hash.slice(0, 10)}...
                                    {tx.hash.slice(-8)}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
