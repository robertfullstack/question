import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { ref, push } from 'firebase/database';
import '../styles/Home.css';
import Logo from '../images/WhatsApp_Image_2025-07-24_at_10.53.57-removebg-preview.png';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

// Import ReactToastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Registro = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const usuariosRef = ref(db, 'usuarios');
    const novoUsuario = { nome, email, senha };

    push(usuariosRef, novoUsuario)
      .then(() => {
        toast.success('Aluno cadastrado com sucesso!');
        setNome('');
        setEmail('');
        setSenha('');
      })
      .catch((error) => {
        console.error('Erro ao cadastrar:', error);
        toast.error('Erro ao cadastrar. Tente novamente.');
      });
  };

  return (
    <div className="login-container">
      <ToastContainer /> {/* Toast container precisa estar presente */}
      <div className="login-glass">
        <img
          src={Logo}
          alt="Comunica Quest"
          className="login-logo"
          style={{ width: '200px', marginLeft: '-20px', marginBottom: '0px' }}
        />
        <h2 className="login-title">Cadastro de Aluno</h2>
        <p className="login-subtitle">Preencha seus dados institucionais</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <FiUser className="input-icon" />
            <input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              placeholder="E-mail institucional"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type={verSenha ? 'text' : 'password'}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <span
              className="toggle-eye"
              onClick={() => setVerSenha(!verSenha)}
              title={verSenha ? 'Ocultar senha' : 'Mostrar senha'}
              style={{ cursor: 'pointer' }}
            >
              {verSenha ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <button type="submit" className="login-button">
            Cadastrar
          </button>
        </form>

        <div className="login-links">
          <p>
            Já tem conta? <Link to="/">Fazer login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registro;
