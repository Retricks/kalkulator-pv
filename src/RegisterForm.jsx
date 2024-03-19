import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Hasła nie pasują do siebie');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/register', {
        username,
        password,
      });
      setMessage("Pomyślnie zarejestrowano");
    } catch (error) {
      console.error('Błąd rejestracji:', error.response.data.error);
      setError('Nie udało się zarejestrować');
    }
  };

  return (
    <div className='login-form'>
    <div className='login-form__container'>
      <h2>Formularz rejestracji</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form__group field">
            <input className="form__field" type="text" placeholder="Login" name="username" id="username" value={username} onChange={e => setUsername(e.target.value)}/>
            <label htmlFor="username" className="form__label">Login</label>
        </div>
        <div className="form__group field">
            <input className="form__field" type="password" placeholder="Hasło" name="password" id="password" value={password} onChange={e => setPassword(e.target.value)}/>
            <label htmlFor="password" className="form__label">Hasło</label>
        </div>
        <div className="form__group field">
            <input className="form__field" type="password" placeholder="Hasło" name="password" id="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}/>
            <label htmlFor="password" className="form__label">Powtórz hasło</label>
        </div>
        <button type="submit">Zarejestruj</button>
      </form>
    </div>
    </div>
  );
};

export default RegisterForm;
