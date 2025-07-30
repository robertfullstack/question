import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { ref, push } from 'firebase/database'; // ✅ correto na v9+
import '../styles/Home.css';

const Registro = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const usuariosRef = ref(db, 'usuarios');
    const novoUsuario = { nome, email, senha };

    push(usuariosRef, novoUsuario)
      .then(() => {
        alert('Aluno cadastrado com sucesso!');
        setNome('');
        setEmail('');
        setSenha('');
      })
      .catch((error) => {
        console.error('Erro ao cadastrar:', error);
        alert('Erro ao cadastrar. Tente novamente.');
      });
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2 className="login-title">Cadastro de Aluno</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="nome">Nome completo</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />

          <label htmlFor="email">E-mail institucional</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label htmlFor="senha">Senha</label>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />

          <button type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  );
};

export default Registro;
