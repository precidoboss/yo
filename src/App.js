import React, { useState } from "react";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";

const AVAX_RPC_URL = "https://api.avax.network/ext/bc/C/rpc";

function App() {
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [connecting, setConnecting] = useState(false);

  const connectWallet = async () => {
    setConnecting(true);
    try {
      const wcProvider = new WalletConnectProvider({
        rpc: {
          43114: AVAX_RPC_URL
        },
        chainId: 43114
      });

      await wcProvider.enable();

      const ethersProvider = new ethers.BrowserProvider(wcProvider);
      setProvider(ethersProvider);

      const signer = await ethersProvider.getSigner();
      const userAddress = await signer.getAddress();
      setAddress(userAddress);

      const bal = await ethersProvider.getBalance(userAddress);
      setBalance(ethers.formatEther(bal));
    } catch (err) {
      alert("Failed to connect wallet: " + err);
    }
    setConnecting(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center", fontFamily: "sans-serif" }}>
      <h2>AVAX Balance Checker</h2>
      {address ? (
        <>
          <div>
            <strong>Connected Address:</strong>
            <p>{address}</p>
          </div>
          <div>
            <strong>Balance:</strong>
            <p>{balance} AVAX</p>
          </div>
        </>
      ) : (
        <button onClick={connectWallet} disabled={connecting}>
          {connecting ? "Connecting..." : "Connect Trust Wallet"}
        </button>
      )}
    </div>
  );
}

export default App;