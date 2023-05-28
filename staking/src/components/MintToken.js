import React from "react";
import { useState } from "react";
import "./MintToken.css";

export default function MintToken(contract, provider, account) {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSymbolChange = (event) => {
    setSymbol(event.target.value);
  };

  const handleTotalSupplyChange = (event) => {
    setTotalSupply(event.target.value);
  };

  async function mint() {
    try {
      await contract.contract.mintToken(name, symbol, totalSupply);
      //Event emit
      contract.contract.on(
        "TokenMinted",
        (tokenAddress, name, symbol, totalSupply, owner) => {
          alert(
            `${owner} minted ${tokenAddress} with totalSupply of ${totalSupply}`
          );
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  console.log(contract);

  return (
    <>
      <div className="form">
        <h3>Account: {contract.account}</h3>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="input"
          />
        </label>
        <br />
        <label>
          Symbol:
          <input
            type="text"
            value={symbol}
            onChange={handleSymbolChange}
            className="input"
          />
        </label>
        <br />
        <label>
          Total Supply:
          <input
            type="number"
            value={totalSupply}
            onChange={handleTotalSupplyChange}
            className="input"
          />
        </label>
        <br />
        <button onClick={mint} className="button">
          Submit
        </button>
      </div>
    </>
  );
}
