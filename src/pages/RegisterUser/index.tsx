import React, { useState } from 'react';

import api from '../../services/api';
import axios from 'axios';

import { cpfMask, cepMask } from '../../utils/mask';
import * as EmailValidator from 'email-validator';

import NavBar from '../../components/NavBar';

import Swal from 'sweetalert2';
import './style.css';

const RegisterUsers = () => {
  const initialState = {
    name: '',
    cpf: '',
    email: '',
    cep: '',
    street: '',
    streetNumber: '',
    neighborhood: '',
    city: '',
  };

  const autoCompleteAddress = async cep => {
    const response = await axios.get(`http://viacep.com.br/ws/${cep}/json`);
    const { bairro, localidade, logradouro } = response.data;
    setUserInfos({
      ...userInfos,
      street: logradouro,
      neighborhood: bairro,
      city: localidade,
    });
  };

  const [userInfos, setUserInfos] = useState(initialState);

  const handleChange = e =>
    setUserInfos({ ...userInfos, [e.target.name]: e.target.value });

  const registerUser = async () => {
    const {
      name,
      cpf,
      email,
      cep,
      street,
      neighborhood,
      city,
      streetNumber,
    } = userInfos;
    if (
      name.length === 0 ||
      cpf.length === 0 ||
      email.length === 0 ||
      cep.length === 0 ||
      street.length === 0 ||
      neighborhood.length === 0 ||
      city.length === 0 ||
      streetNumber.length === 0
    ) {
      return Swal.fire({
        text:
          'Ocorreu um erro ao cadastrar. Verifique se todos os campos foram preenchidos.',
        icon: 'warning',
      });
    }

    if (!EmailValidator.validate(email)) {
      return Swal.fire({
        text:
          'Esse email não é válido. Digite um email válido para se cadastrar.',
        icon: 'warning',
      });
    }
    try {
      const user = {
        nome: name,
        cpf,
        email,
        endereco: {
          cep,
          rua: street,
          numero: streetNumber,
          bairro: neighborhood,
          cidade: city,
        },
      };
      await api.post('/usuarios', user);
      Swal.fire({
        text: 'Usuário cadastrado com sucesso.',
        icon: 'success',
      });
      setUserInfos(initialState);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <NavBar />
      <div className='container-register'>
        <h2>Cadastrar usuário</h2>
        <div>
          <input
            className='input-register'
            type='text'
            name='name'
            id='name'
            onChange={handleChange}
            value={userInfos.name}
            placeholder='Digite seu nome'
          />
        </div>
        <div>
          <input
            className='input-register'
            type='text'
            name='cpf'
            onChange={handleChange}
            value={cpfMask(userInfos.cpf)}
            placeholder='Digite seu CPF'
          />
        </div>
        <div>
          <input
            className='input-register'
            type='text'
            name='email'
            onChange={handleChange}
            value={userInfos.email}
            placeholder='Digite seu email'
          />
        </div>
        <div>
          <input
            className='input-register'
            type='text'
            name='cep'
            onChange={handleChange}
            onBlur={() => autoCompleteAddress(userInfos.cep)}
            value={cepMask(userInfos.cep)}
            placeholder='Digite seu CEP'
          />
        </div>
        <div>
          <input
            className='input-register'
            type='text'
            name='city'
            onChange={handleChange}
            value={userInfos.city}
            placeholder='Digite o nome da sua cidade'
          />
        </div>
        <div>
          <input
            className='input-register'
            type='text'
            name='neighborhood'
            onChange={handleChange}
            value={userInfos.neighborhood}
            placeholder='Digite o nome do seu bairro'
          />
        </div>
        <div>
          <input
            className='input-register'
            type='text'
            name='street'
            onChange={handleChange}
            value={userInfos.street}
            placeholder='Digite o nome sua rua'
          />
        </div>
        <div>
          <input
            className='input-register'
            type='text'
            name='streetNumber'
            onChange={handleChange}
            value={userInfos.streetNumber}
            placeholder='Digite o número da sua casa'
          />
        </div>
        <button className='btn-register' onClick={registerUser}>
          Cadastrar
        </button>
      </div>
    </>
  );
};

export default RegisterUsers;
