import React, { useState } from "react";
import { useAccount } from "wagmi";
import { buttonVariants } from "../ui/button";
import { Card } from "@/components/ui/card";
import { depositTransaction } from "@/lib/contract/deposit";

const DepositPage = () => {
  const [depositAmount, setDepositAmount] = useState(0); // State to hold the deposit amount
  const address = useAccount().address;
  const feePercentage = 2.5;
  const fee = (depositAmount * feePercentage) / 100;
  const totalAmount = depositAmount - fee;

  const cardStyle = {
    width: '400px',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    margin: '0 auto',
    textAlign: 'center'
  };

  const titleStyle = {
    fontSize: '1.5rem',
    marginBottom: '20px'
  };

  const inputContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const inputFieldStyle = {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginRight: '10px',
    width: '200px'
  };

  const handleDeposit = () => {
    console.log(depositAmount)
    depositTransaction(depositAmount + "")
    setDepositAmount(0);
  };

  return (
    <Card style={cardStyle}>
      <h2 style={titleStyle}>Deposit Money</h2>

      {/* Input field for depositing money */}
      <div style={inputContainerStyle}>
        <input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(parseFloat(e.target.value))}
          placeholder="Enter deposit amount"
          style={inputFieldStyle}
        />
        <button
          onClick={handleDeposit}
          style={{ height:"45px" }}
          className={buttonVariants({ variant: "secondary" })}
        >
          Deposit
        </button>
      </div>
      <p style={{marginTop: '20px'}}>Total amount to deposit with {feePercentage}% fee: {totalAmount}SEP</p>
      <p style={{fontSize: '75%'}}>Transaction will ask for {depositAmount}SEP because of fees</p>
    </Card>
  );
};

export default DepositPage;
