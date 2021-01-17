import React, { useEffect, useState } from 'react';

import api from '../../services/api';

interface User {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  endereco: {
    cep: string;
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
  };
}
const Users = () => {
  useEffect(() => {
    const getUsers = async () => {
      const users = await api.get('/usuarios');
      setUsers(users.data);
    };
    getUsers();
  }, []);

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [editModal, setEditModal] = useState({
    nome: '',
    cpf: '',
    email: '',
    endereco: { cep: '', rua: '', numero: '', bairro: '', cidade: '' },
  });

  const updateUser = async (id) => {
    try {
      const user = await api.get('/usuarios/2');
    } catch (e) {
      console.log(e);
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/usuarios/${id}`);
    } catch (e) {
      console.log(e);
    }
    const filteredUsers = users.filter((user) => user.id !== id);
    setUsers(filteredUsers);
  };

  const filteredUsers = users.filter((user) =>
    user.nome.toLowerCase().includes(search.toLowerCase())
  );

  const modalEdit = async (id) => {
    try {
      const user = await api.get(`/usuarios/${id}`);
      setEditModal(user.data);
    } catch (e) {
      console.log(e);
    }
  };
  console.log(editModal);

  return (
    <>
      <label htmlFor='search'>Busca</label>
      <input
        type='text'
        id='search'
        placeholder='Pesquise pelo nome'
        onChange={(e) => setSearch(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Email</th>
            <th>Cidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.nome}</td>
              <td>{user.cpf}</td>
              <td>{user.email}</td>
              <td>{user['endereco'].cidade}</td>
              <td>
                <button
                  data-toggle='modal'
                  data-target='#editModal'
                  onClick={() => modalEdit(user.id)}
                >
                  Editar
                </button>
              </td>
              <td>
                <button onClick={() => deleteUser(user.id)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        className='modal fade'
        id='editModal'
        role='dialog'
        aria-labelledby='exampleModalLongTitle'
        aria-hidden='true'
      >
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='exampleModalLongTitle'>
                Editar usuário!!!!
              </h5>
              <button
                type='button'
                className='close'
                data-dismiss='modal'
                aria-label='Close'
              >
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div className='modal-body'>
              <div className='form-group'>
                <label>
                  <strong>Nome:</strong>
                </label>
                <input
                  type='text'
                  id='name'
                  placeholder='Digita o seu nome'
                  value={editModal.nome}
                  name='name'
                />
              </div>
              <div className='form-group'>
                <label htmlFor='cpf'>
                  <strong>CPF:</strong>
                </label>
                <input
                  type='text'
                  id='cpf'
                  name='cpf'
                  value={editModal.cpf}
                  placeholder='Digite seu CPF'
                />
              </div>
              <div className='form-group'>
                <label htmlFor='email'>
                  <strong>Email: </strong>
                </label>
                <input
                  type='text'
                  name='email'
                  id='email'
                  placeholder='Digite seu email'
                />
              </div>
              <div className='form-group'>
                <label htmlFor='cep'>
                  <strong>CEP</strong>
                </label>
                <input
                  type='text'
                  id='cep'
                  name='cep'
                  placeholder='Digite seu CEP'
                />
              </div>
              <div className='form-group'>
                <label htmlFor='city'>
                  <strong>Cidade</strong>
                </label>
                <input
                  type='text'
                  id='city'
                  name='city'
                  placeholder='Digite sua cidade'
                />
              </div>
              <div className='form-group'>
                <label>
                  <strong>Bairro</strong>
                </label>
                <input type='text' placeholder='URL da imagem' name='image' />
              </div>
              <div className='form-group'>
                <label>
                  <strong>Rua</strong>
                </label>
                <input type='text' placeholder='URL da imagem' name='image' />
              </div>
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-secondary'
                data-dismiss='modal'
              >
                Fechar
              </button>
              <button type='button' className='btn btn-primary'>
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
