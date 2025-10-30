import React, { useState } from "react";
import { donate, withdrawFunds } from "../web3";

function Donation() {
    const [amount, setAmount] = useState("");

    return (
        <div>
            <h2>Donate to Campaign</h2>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount in ETH"
            />
            <button onClick={() => donate(amount)}>Donate</button>

            <h3>Campaign Owner Actions</h3>
            <button onClick={withdrawFunds}>Withdraw Funds</button>
        </div>
    );
}

export default Donation;
