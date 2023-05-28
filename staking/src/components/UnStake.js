import React, { useState, useEffect } from "react";

export default function UnStake({ contract, provider, account }) {
  const [tokenInfoList, setTokenInfoList] = useState([]);
  const [UnstakeAmount, setUnStakeAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);

  const handleStakeAmountChange = (event) => {
    setUnStakeAmount(Number(event.target.value));
  };

  const handleStake = (token) => {
    setSelectedToken(token);
    setShowModal(true);
  };

  const handleConfirmStake = () => {
    if (selectedToken) {
      unStake();
      setUnStakeAmount("");
      setSelectedToken(null);
      setShowModal(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedToken(null);
    setUnStakeAmount("");
    setShowModal(false);
  };

  useEffect(() => {
    getTokenInfo();
  }, []);

  async function getTokenInfo() {
    try {
      const addressArray = await contract.OwnerToken(account);
      const updatedTokenInfoList = await Promise.all(
        addressArray.map(async (address) => {
          let balance = await contract.stakeAmount(account, address);
          balance = Number(balance);

          const timestamp = await contract.TimeStamp(account, address);
          const date = new Date(timestamp * 1000);
          const localDate = date.toLocaleString();

          const tokenInfo = await contract.tokens(address);

          if (typeof balance === "undefined") {
            return null;
          }

          return {
            tokenAddress: tokenInfo.tokenAddress,
            name: tokenInfo.name,
            symbol: tokenInfo.symbol,
            balance: balance.toString(),
            timestamp: localDate.toString(),
          };
        })
      );

      const filteredTokenInfoList = updatedTokenInfoList.filter(
        (tokenInfo) =>
          tokenInfo !== null &&
          typeof tokenInfo.balance !== "undefined" &&
          Number(tokenInfo.balance) > 0
      );

      setTokenInfoList(filteredTokenInfoList);
    } catch (error) {
      console.error(error);
    }
  }

  async function unStake() {
    try {
      console.log(selectedToken);
      await contract.unstake(selectedToken.tokenAddress, UnstakeAmount);

      contract.on(
        "unstakesuccess",
        (tAddress, amount, timestamp, totalReward) => {
          const date = new Date(timestamp * 1000);
          const localDate = date.toLocaleString();
          alert(
            `${amount} of ${tAddress} has been unstaked at ${localDate} with total reward of ${totalReward}`
          );
        }
      );
    } catch (error) {
      if (error.message.includes("paused")) {
        window.alert("Staking has been paused");
      }
    }
  }

  return (
    <>
      <div className="container">
        <h2>Your Tokens</h2>
        <h3>{account}</h3>
        {tokenInfoList.map((tokenInfo, index) => (
          <div key={index} className="token-info">
            <p className="token-address">
              Token Address: {tokenInfo.tokenAddress}
            </p>
            <p>Name: {tokenInfo.name}</p>
            <p>Symbol: {tokenInfo.symbol}</p>
            <p>Staked Date: {tokenInfo.timestamp}</p>
            <p className="balance">Staked Amount: {tokenInfo.balance}</p>

            <button
              className="stake-button"
              onClick={() => handleStake(tokenInfo)}
            >
              UnStake and Claim Reward
            </button>
          </div>
        ))}

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Unstake and Claim Rewards</h3>
              <input
                type="number"
                value={UnstakeAmount}
                onChange={handleStakeAmountChange}
                placeholder="Enter the amount to Unstake"
              />
              <button onClick={handleConfirmStake}>Confirm UnStake</button>
              <button onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
