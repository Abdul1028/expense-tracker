import React, { useState } from 'react';

const ExpenseSplitter = () => {
  const [groupName, setGroupName] = useState('');
  const [userName, setUserName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const [paidBy, setPaidBy] = useState('');
  const [users, setUsers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showDebts, setShowDebts] = useState(false);

  const handleAddUser = () => {
    setUsers([...users, userName]);
    setUserName('');
  };

  const handleAddExpense = () => {
    setExpenses([...expenses, { description, amount, paidBy }]);
    setDescription('');
    setAmount(0);
    setPaidBy('');
  };

  const calculateBalances = () => {
    const balances = {};
    users.forEach(user => {
      balances[user] = 0;
    });

    expenses.forEach(expense => {
      balances[expense.paidBy] += expense.amount;
      const share = expense.amount / (users.length - 1);
      users.forEach(user => {
        if (user !== expense.paidBy) {
          balances[user] -= share;
        }
      });
    });

    return balances;
  };

  const calculateDebts = () => {
    const balances = calculateBalances();
    const debts = {};

    Object.entries(balances).forEach(([user, balance]) => {
      if (balance < 0) {
        debts[user] = {};
        Object.entries(balances).forEach(([otherUser, otherBalance]) => {
          if (otherBalance > 0) {
            const amountToTransfer = Math.min(-balance, otherBalance);
            debts[user][otherUser] = amountToTransfer;
            balance += amountToTransfer;
            balances[otherUser] -= amountToTransfer;
          }
        });
      }
    });

    return debts;
  };

  const handleGroupCreation = () => {
    // Perform any necessary actions for group creation
    // For now, let's just log the group name and users
    console.log("Group Name:", groupName);
    console.log("Users:", users);
  };

  const handleBalanceClick = () => {
    // You can display the balances in your UI as needed
  };

  console.log(showDebts);

  return (
    <div>
      <h2>Expense Splitter</h2>
      <label>
        Group Name:
        <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
      </label>
      <button onClick={handleGroupCreation}>Create Group</button>

      <h3>Add Users</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
      <label>
        Add User:
        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
        <button onClick={handleAddUser}>Add</button>
      </label>

      <h3>Add Expense</h3>
      <label>
        Description:
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <label>
        Amount:
        <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} />
      </label>
      <label>
        Paid By:
        <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
          <option value="">Select</option>
          {users.map((user, index) => (
            <option key={index} value={user}>{user}</option>
          ))}
        </select>
      </label>
      <button onClick={handleAddExpense}>Add Expense</button>

      <button onClick={handleBalanceClick}>Check Balances</button>

      {/* Display Expenses */}
      <div>
        <h3>Expenses</h3>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Paid By</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr key={index}>
                <td>{expense.description}</td>
                <td>{expense.amount}</td>
                <td>{expense.paidBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Display Settlement Balances */}
      <div>
        <h3>Settlement Balances</h3>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(calculateBalances()).map(([user, balance]) => (
              <tr key={user}>
                <td>{user}</td>
                <td>{balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button  onClick={(e) => setShowDebts(true)}  >Show Debts</button>

      {/* Display Debts Automatically */}
      <div>
        <h3>Debts</h3>
        <table>

        </table>
      </div>


       {/* Display Debts ON button click dala h */}

      {showDebts && (
        <div>
          <h3>Debts</h3>
          <table>
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(calculateDebts()).map(([from, tos]) =>
              Object.entries(tos).map(([to, amount], index) => (
                <tr key={index}>
                  <td>{from}</td>
                  <td>{to}</td>
                  <td>{amount}</td>
                </tr>
              ))
            )}
          </tbody>
          </table>
        </div>
      )}


    </div>





  );
};

export default ExpenseSplitter;
