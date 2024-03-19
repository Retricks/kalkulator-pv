import React from 'react';

const LogoutButton = ({ handleLogout }) => {

  return (
    <button onClick={handleLogout}>Wyloguj</button>
  );
};

export default LogoutButton;