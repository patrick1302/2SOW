import React, { useEffect, useState, useMemo } from 'react';

import api from '../../services/api';

import NavBar from '../../components/NavBar';

import Swal from 'sweetalert2';

import { cpfMask } from '../../utils/mask';

import './style.css';

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
const ListUsers = () => {
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
    id: null,
    nome: '',
    cpf: '',
    email: '',
    endereco: { cep: '', rua: '', numero: '', bairro: '', cidade: '' },
  });

  const modalEdit = async id => {
    try {
      const user = await api.get(`/usuarios/${id}`);
      setEditModal(user.data);
    } catch (e) {
      console.log(e);
    }
  };

  const updateUser = async () => {
    try {
      const { id } = editModal;
      await api.put(`/usuarios/${id}`, editModal);
      Swal.fire({
        text: 'Usuário atualizado com sucesso',
        icon: 'success',
      });
    } catch (e) {
      console.log(e);
      Swal.fire({
        text: 'Houve algum erro ao atualizar. Tente novamente.',
        icon: 'warning',
      });
    }
  };

  const deleteUser = async id => {
    try {
      await api.delete(`/usuarios/${id}`);
      Swal.fire({
        text: 'Usuário deletado com sucesso',
        icon: 'success',
      });
    } catch (e) {
      console.log(e);
      return Swal.fire({
        text: 'Houve algum erro ao deletar o usuário. Tente novamente',
        icon: 'warning',
      });
    }
    setUsers(users.filter(user => user.id !== id));
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.nome.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    );
  }, [search, users]);

  const handleChange = e => {
    setEditModal({ ...editModal, [e.target.name]: e.target.value });
  };

  return (
    <>
      <NavBar />
      <div className='box-search'>
        <input
          type='text'
          id='search'
          className='search-input'
          placeholder='Pesquise pelo nome'
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <main className='main-table'>
        <table className='table' style={{ margin: '20px' }}>
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
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td data-label='Nome'>{user.nome}</td>
                <td data-label='CPF'>{user.cpf}</td>
                <td data-label='Email'>{user.email}</td>
                <td data-label='Cidade'>{user['endereco'].cidade}</td>
                <td data-label='Ações'>
                  <button
                    className='edit-button'
                    data-toggle='modal'
                    data-target='#editModal'
                    onClick={() => modalEdit(user.id)}
                  >
                    Editar
                  </button>
                  <button
                    className='delete-button'
                    onClick={() => deleteUser(user.id)}
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
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
                Editando usuário
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
                  name='nome'
                  value={editModal.nome}
                  onChange={handleChange}
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
                  placeholder='Digite seu CPF'
                  value={cpfMask(editModal.cpf)}
                  onChange={handleChange}
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
                  value={editModal.email}
                  onChange={handleChange}
                />
              </div>
              <div className='form-group'>
                <label htmlFor='cidade'>
                  <strong>Cidade</strong>
                </label>
                <input
                  type='text'
                  id='cidade'
                  placeholder='Digite sua cidade'
                  value={editModal.endereco.cidade}
                  onChange={e =>
                    setEditModal({
                      ...editModal,
                      endereco: {
                        ...editModal.endereco,
                        cidade: e.target.value,
                      },
                    })
                  }
                />
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
              <button
                type='button'
                className='btn btn-primary'
                onClick={updateUser}
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListUsers;
