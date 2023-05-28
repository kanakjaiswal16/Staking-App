import Defi from "./artifacts/contracts/Defi.sol/DeFi.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MintToken from "./components/MintToken";
import StakeDashboard from "./components/StakeDashboard";
import Stake from "./components/Stake";
import UnStake from "./components/UnStake";
import Admin from "./components/Admin";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const loadProvider = async () => {
        //To change account as changed on metamask without reloading
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0xE867E98f6d78816b30B4B3ca324b4B6C3f9ab57A";
        const contract = new ethers.Contract(contractAddress, Defi.abi, signer);
        setContract(contract);
        setProvider(provider);
      };
      provider && loadProvider();
    } else {
      alert("INSTALL METAMASK");
    }
  }, []);

  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<Navbar />} />
          <Route
            path="/MintToken"
            element={
              <MintToken
                contract={contract}
                provider={provider}
                account={account}
              />
            }
          />
          <Route path="/StakeDashboard" element={<StakeDashboard />}></Route>
          <Route
            path="/Stake"
            element={
              <Stake
                contract={contract}
                provider={provider}
                account={account}
              />
            }
          ></Route>
          <Route
            path="/UnStake"
            element={
              <UnStake
                contract={contract}
                provider={provider}
                account={account}
              />
            }
          ></Route>
          <Route
            path="/Admin"
            element={
              <Admin
                contract={contract}
                provider={provider}
                account={account}
              />
            }
          ></Route>
        </Routes>
      </>
    </Router>
  );
}

export default App;
