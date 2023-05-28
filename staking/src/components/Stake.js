import React from "react";
import { useState, useEffect } from "react";
import "./Stake.css";
import Custom from "../artifacts/contracts/Defi.sol/CustomToken.json";
import { ethers } from "ethers";

export default function Stake({ contract, provider, account }) {
  const [tokenInfoList, setTokenInfoList] = useState([]);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [staking, setStaking] = useState(true);

  const handleStakeAmountChange = (event) => {
    setStakeAmount(Number(event.target.value));
  };

  const handleStake = (token) => {
    setSelectedToken(token);
    setShowModal(true);
  };

  async function createTokenContract() {
    try {
      const tokenAddress = selectedToken.tokenAddress;
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(
        tokenAddress,
        Custom.abi,
        signer
      );

      const tokentx = await tokenContract.increaseAllowance(
        contract.address,
        stakeAmount,
        {
          from: account,
        }
      );

      await tokentx.wait();

      alert(
        `${stakeAmount} is allowed to ${account}. Sign one more transaction to stake`
      );

      await contract.stake(tokenAddress, stakeAmount, {
        from: account,
      });

      contract.on("StakeSuccess", (tokenAddress, amount, timstamp) => {
        const date = new Date(timstamp * 1000);
        const localDate = date.toLocaleString();
        alert(`${amount} of token '${tokenAddress}' staked at ${localDate}`);
      });
    } catch (error) {
      if (error.message.includes("paused")) {
        window.alert("Staking has been paused");
      }
    }
  }

  const handleConfirmStake = () => {
    if (selectedToken) {
      createTokenContract();
      setStakeAmount("");
      setSelectedToken(null);
      setShowModal(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedToken(null);
    setStakeAmount("");
    setShowModal(false);
  };

  useEffect(() => {
    getTokenInfo();
  }, []);

  async function getTokenInfo() {
    try {
      const state = await contract.Staking();
      setStaking(state);
      console.log(state);
      const addressArray = await contract.OwnerToken(account);
      const updatedTokenInfoList = await Promise.all(
        addressArray.map(async (address) => {
          const balance = await contract.getTokenBalance(address);
          const tokenInfo = await contract.tokens(address);
          return {
            tokenAddress: tokenInfo.tokenAddress,
            name: tokenInfo.name,
            symbol: tokenInfo.symbol,
            balance: balance.toString(),
          };
        })
      );
      setTokenInfoList(updatedTokenInfoList);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container">
      {staking === false && (
        <>
          <h3 className="stakePause">Staking has been paused</h3>
        </>
      )}
      <h2>Your Tokens</h2>
      <h3>{account}</h3>
      {tokenInfoList.map((tokenInfo, index) => (
        <div key={index} className="token-info">
          <p className="token-address">
            Token Address: {tokenInfo.tokenAddress}
          </p>
          <p>Name: {tokenInfo.name}</p>
          <p>Symbol: {tokenInfo.symbol}</p>
          <p className="balance">Balance: {tokenInfo.balance}</p>
          <button
            className="stake-button"
            onClick={() => handleStake(tokenInfo)}
            disabled={!staking}
          >
            Stake
          </button>
        </div>
      ))}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Stake Tokens</h3>
            <input
              type="number"
              value={stakeAmount}
              onChange={handleStakeAmountChange}
              placeholder="Enter the amount to stake"
            />
            <button onClick={handleConfirmStake}>Confirm Stake</button>
            <button onClick={handleCloseModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
