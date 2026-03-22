"use client";

import { ethers } from "ethers";

export default function WalletConnect({ onConnect }) {
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask");
        return;
      }

      // Request wallet access
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // ✅ IMPORTANT: send BOTH address + provider
      onConnect(address, provider);

    } catch (error) {
      console.error("Wallet connection error:", error);
    }
  };

  return (
    <button onClick={connectWallet}>
      Connect Wallet
    </button>
  );
}