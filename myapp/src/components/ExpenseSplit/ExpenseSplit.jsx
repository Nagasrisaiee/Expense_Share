import React, { useState } from "react";
import "./ExpenseSplit.css";

const ExpenseSplit = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [isNameLocked, setIsNameLocked] = useState(false);

  const addUserExpense = () => {
    if (name && amount) {
      const existingUserIndex = users.findIndex(user => user.name === name);
      if (existingUserIndex !== -1) {
        const updatedUsers = [...users];
        updatedUsers[existingUserIndex].amount += parseFloat(amount);
        setUsers(updatedUsers);
      } else {
        setUsers([...users, { name, amount: parseFloat(amount) }]);
      }
      setAmount("");
    }
  };

  const lockUserName = () => {
    setIsNameLocked(true);
  };

  const resetUserName = () => {
    setIsNameLocked(false);
    setName("");
  };

  const calculateDivision = () => {
    const total = users.reduce((sum, user) => sum + user.amount, 0);
    const perPerson = total / users.length;
    
    const balances = users.map((user) => ({
      name: user.name,
      balance: user.amount - perPerson,
    }));

    const payments = [];
    let debtors = balances.filter(b => b.balance < 0).sort((a, b) => a.balance - b.balance);
    let creditors = balances.filter(b => b.balance > 0).sort((a, b) => b.balance - a.balance);

    while (debtors.length > 0 && creditors.length > 0) {
      let debtor = debtors[0];
      let creditor = creditors[0];
      let transfer = Math.min(-debtor.balance, creditor.balance);

      payments.push(`${debtor.name} pays ${creditor.name} $${transfer.toFixed(2)}`);
      debtor.balance += transfer;
      creditor.balance -= transfer;

      if (debtor.balance === 0) debtors.shift();
      if (creditor.balance === 0) creditors.shift();
    }
    if(payments.length === 0)
        setResult(["NO ONE PAYS NO ONE"]);
    else
        setResult(payments);
  };

  return (
    <div className="expense-container">
      <h2>Expense Splitter</h2>
      <input
        type="text"
        placeholder="User Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isNameLocked}
      />
      <button onClick={lockUserName} disabled={isNameLocked}>Lock Name</button>
      <button onClick={resetUserName}>Change User</button>
      <input
        type="number"
        placeholder="Expense Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={addUserExpense}>Add Expense</button>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user.name}: ${user.amount.toFixed(2)}</li>
        ))}
      </ul>
      <button onClick={calculateDivision}>Calculate Division</button>
      {result && (
        <div className="result-box">
          <h3>Final Settlement:</h3>
          {result.map((r, index) => (
            <p key={index}>{r}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseSplit;
