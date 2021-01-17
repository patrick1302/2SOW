import React, { useState } from 'react';

import api from '../../services/api';
import axios from 'axios';

import * as EmailValidator from 'email-validator';

import Swal from 'sweetalert2';

const cpfMask = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};
const cepMask = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
};
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

  const autoCompleteCep = async (cep) => {
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
  console.log(userInfos);
  const handleChange = (e) =>
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
      const save = {
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
      await api.post('/usuarios', save);
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
      <div>
        <label htmlFor='name'>Nome</label>
        <input
          type='text'
          name='name'
          id='name'
          onChange={handleChange}
          value={userInfos.name}
        />
      </div>
      <div>
        <label htmlFor='cpf'>CPF</label>
        <input
          type='text'
          name='cpf'
          id='cpf'
          onChange={handleChange}
          value={cpfMask(userInfos.cpf)}
        />
      </div>
      <div>
        <label htmlFor='email'>Email</label>
        <input
          type='text'
          name='email'
          id='email'
          onChange={handleChange}
          value={userInfos.email}
        />
      </div>
      <div>
        <label htmlFor='cep'>CEP</label>
        <input
          type='text'
          name='cep'
          id='cep'
          onChange={handleChange}
          onBlur={() => autoCompleteCep(userInfos.cep)}
          value={cepMask(userInfos.cep)}
        />
      </div>
      <div>
        <label htmlFor='city'>Cidade</label>
        <input
          type='text'
          name='city'
          id='city'
          onChange={handleChange}
          value={userInfos.city}
        />
      </div>
      <div>
        <label htmlFor='neighborhood'>Bairro</label>
        <input
          type='text'
          name='neighborhood'
          id='neighborhood'
          onChange={handleChange}
          value={userInfos.neighborhood}
        />
      </div>
      <div>
        <label htmlFor='street'>Rua</label>
        <input
          type='text'
          name='street'
          id='street'
          onChange={handleChange}
          value={userInfos.street}
        />
      </div>
      <div>
        <label htmlFor='streetNumber'>Número</label>
        <input
          type='text'
          name='streetNumber'
          id='streetNumber'
          onChange={handleChange}
          value={userInfos.streetNumber}
        />
      </div>

      <button onClick={registerUser}>Cadastrar</button>
    </>
  );
};

export default RegisterUsers;
