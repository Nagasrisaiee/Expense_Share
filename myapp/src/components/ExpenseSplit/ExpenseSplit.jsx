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

    let userLength = users.length
    console.log("users",users)
    console.log(userLength);
    

    const individualShares = users.map((user) => ({
        name: user.name,
        share : user.amount/userLength,
    }));
    
    const Payments =[]

    const results = individualShares.map((user,i) => {
        return {
            name:user.name,
            updatedAmounts : individualShares.map((otherUsers) => ({
                name:otherUsers.name,
                amount: (otherUsers.share - user.share > 0 ? (otherUsers.share - user.share) : 0)
            }))
        };
    });

    results.forEach(obj => {
        obj.updatedAmounts.forEach(person => {
            if(person.amount > 0){
              Payments.push(`${obj.name} Should give $${Math.round(person.amount)} to ${person.name}`);
            }
        });
    });

    console.log(results);

    console.log("Pa",Payments);

    if(Payments.length === 0)
      setResult(["All Expenses are balanced... Thank you"]);
    else
      setResult(Payments);

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
      <button onClick={calculateDivision}>My Trail Balance</button>
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
