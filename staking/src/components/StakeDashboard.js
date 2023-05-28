import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./navbar.css";

export default function StakeDashboard() {
  return (
    <>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/Stake">Stake Token</Link>
            </li>
            <li>
              <Link to="/UnStake">UnStake Token</Link>
            </li>
          </ul>
        </nav>

        <Outlet />
      </div>
    </>
  );
}
