import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddAccount.css';

function AddAccount() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accountHolder: '',
    accountType: 'SAVINGS',
    openingBalance: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'openingBalance' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.accountHolder.trim()) {
      setError('Account holder name is required');
      return;
    }

    if (formData.openingBalance < 0) {
      setError('Opening balance cannot be negative');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const command = {
        accountHolder: formData.accountHolder.trim(),
        accountType: formData.accountType,
        openingBalance: formData.openingBalance
      };

      await axios.post('/api/v1/openBankAccount', command);

      setSuccess('Account created successfully!');
      setFormData({
        accountHolder: '',
        accountType: 'SAVINGS',
        openingBalance: 0
      });

      // Redirect to account list after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (err) {
      setError('Failed to create account. Please try again.');
      console.error('Error creating account:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Add New Account</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="account-form">
          <div className="form-group">
            <label htmlFor="accountHolder">Account Holder Name *</label>
            <input
              type="text"
              id="accountHolder"
              name="accountHolder"
              value={formData.accountHolder}
              onChange={handleInputChange}
              required
              placeholder="Enter account holder name"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="accountType">Account Type</label>
            <select
              id="accountType"
              name="accountType"
              value={formData.accountType}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="SAVINGS">Savings Account</option>
              <option value="CHECKING">Checking Account</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="openingBalance">Opening Balance ($)</label>
            <input
              type="number"
              id="openingBalance"
              name="openingBalance"
              value={formData.openingBalance}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              placeholder="0.00"
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAccount;