import React from 'react';

import { Link, useHistory } from 'react-router-dom';

import { RiLogoutCircleLine } from 'react-icons/ri';
import './style.css';

const NavBar = () => {
  const history = useHistory();

  const logout = () => {
    localStorage.removeItem('token');
    history.push('/');
  };
  return (
    <nav className='menu'>
      <h2 className='logo'>Logo</h2>
      <ul>
        <li>
          <Link to='/register_user'>Registrar usuário</Link>
        </li>
        <li>
          <Link to='/users'>Listar usuários</Link>
        </li>
      </ul>

      <RiLogoutCircleLine onClick={logout} color='white' size='30' />
    </nav>
  );
};

export default NavBar;
