import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ username, password });
  };

  return (
    <div className='login-form'>
    <div className='login-form__container'>
      <h2>Formularz logowania</h2>
      <form onSubmit={handleSubmit}>
        <div className="form__group field">
            <input className="form__field" type="text" placeholder="Login" name="username" id="username" value={username} onChange={e => setUsername(e.target.value)}/>
            <label htmlFor="username" className="form__label">Login</label>
        </div>
        <div className="form__group field">
            <input className="form__field" type="password" placeholder="Hasło" name="password" id="password" value={password} onChange={e => setPassword(e.target.value)}/>
            <label htmlFor="password" className="form__label">Hasło</label>
        </div>
        <button type="submit">Login</button>
      </form>
      </div>
    </div>
  );
};

export default LoginForm;
