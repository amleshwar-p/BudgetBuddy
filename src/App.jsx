import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);

  // Fetch transactions when the component mounts
  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  // Fetch transactions from the backend
  async function getTransactions() {
    const url = import.meta.env.VITE_APP_API_URL + '/api/transactions';
    const response = await fetch(url);
    return await response.json();
  }

  // Add a new transaction
  function addTransaction(e) {
    e.preventDefault();

    if (!name.trim()) {
      console.error("Transaction name is required");
      return;
    }

    const price = parseFloat(name.split(' ')[0]) || 0;
    const transactionName = name.includes(' ') ? name.substring(name.indexOf(' ') + 1).trim() : name;

    const url = import.meta.env.VITE_APP_API_URL + '/api/transaction';
    

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        price,
        name: transactionName, // Ensure name is always non-empty
        datetime,
        description
      })
    })
      .then(response => response.json())
      .then(json => {
        setName('');
        setDatetime('');
        setDescription('');
        setTransactions(prev => [...prev, json]); // Add new transaction to the list
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  // Calculate the total balance
  const balance = transactions.reduce((acc, transaction) => acc + parseFloat(transaction.price || 0), 0);

  // Reset all transactions
  function resetExpenses() {
    // Send a DELETE request to the backend to reset all transactions
    const url = import.meta.env.VITE_APP_API_URL + '/api/transactions/reset';
    fetch(url, { method: 'DELETE' })
      .then(() => {
        // Clear transactions locally (in the state)
        setTransactions([]);
      })
      .catch(error => {
        console.error('Error resetting transactions:', error);
      });
  }

  return (
    <>
      <main>
        <h1 className="budget-title">BudgetBuddy</h1>
        <h1 className={`balance ${balance >= 0 ? 'positive' : 'negative'}`}>
          ₹{balance.toFixed(2)}
        </h1>

        <form onSubmit={addTransaction}>
          <div className="basic-info">
            <input
              type="text"
              placeholder={'+1000 for Mouse'}
              onChange={e => setName(e.target.value)}
              value={name}
            />
            <input
              type="datetime-local"
              value={datetime}
              onChange={e => setDatetime(e.target.value)}
            />
          </div>
          <div className="description">
            <input
              type="text"
              placeholder={'Description'}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <button type="submit">Add new transaction</button>
        </form>

        <div className="transactions">
          {transactions.length > 0 &&
            transactions.map((transaction, index) => (
              <div className="transaction" key={transaction._id || index}>
                <div className="left">
                  <div className="name">{transaction.name}</div>
                  <div className="description">{transaction.description}</div>
                </div>
                <div className="right">
                  <div
                    className={'price ' + (transaction.price < 0 ? 'red' : 'green')}
                  >
                    ₹{transaction.price}
                  </div>
                  <div className="datetime">{transaction.datetime}</div>
                </div>
              </div>
            ))}
        </div>

        <button onClick={resetExpenses} className="reset-expenses">
          Reset
        </button>
      </main>
    </>
  );
}

export default App;
