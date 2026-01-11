import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AccountList.css';

function AccountList() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactionAmount, setTransactionAmount] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/bankAccountLookup/');
      if (response.data && response.data.accounts) {
        setAccounts(response.data.accounts);
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch accounts');
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const depositFunds = async (accountId, amount) => {
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const command = { amount: parseFloat(amount) };
      await axios.put(`/api/v1/depositFunds/${accountId}`, command);
      setTimeout(fetchAccounts, 1000);
      setTransactionAmount('');
    } catch (err) {
      setError('Failed to deposit funds');
      console.error('Error depositing funds:', err);
    }
  };

  const withdrawFunds = async (accountId, amount) => {
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const command = { amount: parseFloat(amount) };
      await axios.put(`/api/v1/withdrawFunds/${accountId}`, command);
      setTimeout(fetchAccounts, 1000);
      setTransactionAmount('');
    } catch (err) {
      setError('Failed to withdraw funds');
      console.error('Error withdrawing funds:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading accounts...</div>
      </div>
    );
  }

return (
    <div className="container">
        <div className="header-section">
            <h2>Account List</h2>
            <button onClick={fetchAccounts}  title="Refresh">
                <span className="refresh-icon">🔄</span>
            </button>
        </div>

        {error && (
            <div className="error-message">
                {error}
            </div>
        )}

        {accounts.length === 0 ? (
            <div className="no-accounts">
                <p>No accounts found. <a href="/add-account">Create your first account</a></p>
            </div>
        ) : (
            <div className="table-container">
                <table className="accounts-table">
                    <thead>
                        <tr>
                            <th>Account ID</th>
                            <th>Account Holder</th>
                            <th>Account Type</th>
                            <th>Balance</th>
                            <th>Created Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((account) => (
                            <tr key={account.id}>
                                <td className="account-id">{account.id}</td>
                                <td>{account.accountHolder}</td>
                                <td>
                                    <span className={`account-type ${account.accountType.toLowerCase()}`}>
                                        {account.accountType}
                                    </span>
                                </td>
                                <td className="balance">{formatCurrency(account.balance)}</td>
                                <td>{formatDate(account.creationDate)}</td>
                                <td>
                                    <div className="action-buttons">
                                        <div className="transaction-group">
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="Amount"
                                                value={transactionAmount}
                                                onChange={(e) => setTransactionAmount(e.target.value)}
                                                className="amount-input"
                                            />
                                            <button
                                                onClick={() => depositFunds(account.id, transactionAmount)}
                                                className="btn btn-success btn-small"
                                                disabled={!transactionAmount || transactionAmount <= 0}
                                                style={{ fontSize: '10px' }}
                                            >
                                                Deposit
                                            </button>
                                            <button
                                                onClick={() => withdrawFunds(account.id, transactionAmount)}
                                                className="btn btn-danger btn-small"
                                                disabled={!transactionAmount || transactionAmount <= 0}
                                                style={{ fontSize: '10px' }}
                                            >
                                                Withdraw
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);
}

export default AccountList;