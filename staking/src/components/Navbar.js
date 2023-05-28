import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  return (
    <div>
      <nav>
        <img
          style={{ height: "33px", width: "33px" }}
          src="download (1).png"
          alt="error"
        />
        <h3 style={{ position: "relative", left: "-546px" }}>
          <Link to="/" style={{ fontSize: "24px" }}>
            Staking
          </Link>
        </h3>
        <ul>
          <li>
            <Link to="/Admin">Admin</Link>
          </li>
          <li>
            <Link to="/MintToken">Mint Token</Link>
          </li>
          <li>
            <Link to="/StakeDashboard">Stake Token</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </div>
  );
}
