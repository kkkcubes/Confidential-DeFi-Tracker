"use client";

import { useState, useEffect } from "react"; // ✅ FIXED (single import)
import WalletConnect from "../components/WalletConnect";
import { ethers } from "ethers";
import { encryptData, generateKey } from "../crypto/encryption";

export default function Home() {
  const [wallets, setWallets] = useState([]);
  const [tvl, setTvl] = useState(null);

  // ✅ FETCH TVL FROM BACKEND
  useEffect(() => {
    const fetchTVL = async () => {
      try {
        const res = await fetch("/api/tvl");
        const data = await res.json();
        setTvl(data.tvl);
      } catch (err) {
        console.error("Failed to fetch TVL:", err);
      }
    };

    fetchTVL();
  }, []);

  const handleConnect = async (address, provider) => {
    const balanceWei = await provider.getBalance(address);
    const balanceEth = ethers.formatEther(balanceWei);

    const portfolio = {
      address,
      balance: balanceEth,
      fakeBalance: parseFloat(balanceEth),
    };

    const key = generateKey();
    const encrypted = await encryptData(portfolio, key);
    console.log("Encrypted Data:", encrypted);

   await fetch("http://localhost:5000/api/store", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    encryptedData: encrypted,
    fakeBalance: parseFloat(balanceEth), // for TVL only
  }),
});

    console.log("Sent to backend");

    // ✅ UPDATE ONLY WALLETS (NOT TVL)
    setWallets((prev) => [
      ...prev,
      {
        address,
        balance: balanceEth,
        status: "Encrypted & stored",
      },
    ]);

    // ✅ OPTIONAL: refresh TVL after storing
    try {
      const res = await fetch("/api/tvl");
      const data = await res.json();
      setTvl(data.tvl);
    } catch (err) {
      console.error("TVL refresh failed:", err);
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        color: "#222",
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "#2c3e50" }}>
        Confidential DeFi Tracker
      </h1>

      <WalletConnect onConnect={handleConnect} />

      {/* ✅ FIXED TVL DISPLAY */}
      <h2 style={{ marginTop: "20px", color: "#27ae60" }}>
        Total Value Locked (TVL):{" "}
        {tvl !== null ? `${tvl} ETH` : "Loading..."}
      </h2>

      {wallets.length > 0 && (
        <table
          style={{
            marginTop: "30px",
            borderCollapse: "collapse",
            width: "100%",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#2c3e50", color: "#fff" }}>
              <th style={{ padding: "12px", textAlign: "left" }}>Address</th>
              <th style={{ padding: "12px", textAlign: "left" }}>
                ETH Balance
              </th>
              <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((wallet, index) => (
              <tr
                key={wallet.address}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f9fbfc" : "#eef2f5",
                }}
              >
                <td style={{ padding: "10px", color: "#2980b9" }}>
                  {wallet.address}
                </td>
                <td style={{ padding: "10px", color: "#27ae60" }}>
                  {wallet.balance}
                </td>
                <td style={{ padding: "10px", color: "#e67e22" }}>
                  {wallet.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}