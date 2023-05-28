import React, { useState, useEffect } from "react";
import "./Admin.css";

export default function Admin({ contract, provider, account }) {
  const [Admin, setAdmin] = useState(false);
  const [isStakingPaused, setIsStakingPaused] = useState(false);

  const handlePauseClick = () => {
    pauseStaking();
    setIsStakingPaused(true);
    localStorage.setItem("isStakingPaused", "true");
  };

  async function pauseStaking() {
    await contract.stopStaking();
  }

  async function ResumeStaking() {
    await contract.startStaking();
  }

  const handleResumeClick = () => {
    ResumeStaking();
    setIsStakingPaused(false);
    localStorage.setItem("isStakingPaused", "false");
  };

  async function checkAdmin() {
    try {
      const t = await contract.Owner();
      console.log(t);
      setAdmin(t);
    } catch (error) {
      if (error.message.includes("OnlyOwner")) {
        window.alert("Access Denied, only Owner can access this section");
      }
    }
  }

  useEffect(() => {
    checkAdmin();
    const storedIsStakingPaused = localStorage.getItem("isStakingPaused");
    if (storedIsStakingPaused !== null) {
      setIsStakingPaused(storedIsStakingPaused === "true");
    }
  }, []);

  return (
    <>
      {Admin === true && (
        <>
          <div className="button-container">
            <button
              className={isStakingPaused ? "button-disabled" : "button-enabled"}
              onClick={handlePauseClick}
              disabled={isStakingPaused}
            >
              Pause Staking
            </button>
            <button
              className={
                !isStakingPaused ? "button-disabled" : "button-enabled"
              }
              onClick={handleResumeClick}
              disabled={!isStakingPaused}
            >
              Resume Staking
            </button>
          </div>
        </>
      )}
    </>
  );
}
