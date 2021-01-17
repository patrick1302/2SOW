import React, { useState } from 'react';
import * as EmailValidator from 'email-validator';
import { Link, useHistory } from 'react-router-dom';

import Swal from 'sweetalert2';

const Login = () => {
  const [infoLogin, setInfoLogin] = useState({ email: '', password: '' });

  const history = useHistory();

  const handleChange = (e) =>
    setInfoLogin({ ...infoLogin, [e.target.name]: e.target.value });

  const login = () => {
    const { email, password } = infoLogin;
    const isValidEmail = EmailValidator.validate(email);
    const isValidPassword = password.length > 4 ? true : false;

    if (!isValidEmail) {
      return Swal.fire({
        text: 'Você deve digitar um email válido.',
        icon: 'warning',
      });
    }
    if (!isValidPassword) {
      return Swal.fire({
        text: 'A senha deve ter mais de 4 caracteres.',
        icon: 'warning',
      });
    }

    const fakeToken = `${(Date.now() * Math.random()).toString(36)}`;
    localStorage.setItem('token', fakeToken);

    history.push('/users');
  };
  return (
    <>
      <div>
        <label htmlFor='email'>Email</label>
        <input
          type='text'
          name='email'
          id='email'
          onChange={handleChange}
          value={infoLogin.email}
        />
      </div>
      <div>
        <label htmlFor='password'>Senha</label>
        <input
          type='password'
          name='password'
          id='password'
          onChange={handleChange}
          value={infoLogin.password}
        />
      </div>
      <button type='submit' className='btn-login' onClick={login}>
        Login
      </button>
    </>
  );
};

export default Login;
