import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { ref, get } from 'firebase/database';
import '../styles/Home.css';
import Logo from '../images/WhatsApp_Image_2025-07-24_at_10.53.57-removebg-preview.png'; // logo salva em src/images/logo.png
import { FiMail, FiLock } from 'react-icons/fi';

const Home = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const usuariosRef = ref(db, 'usuarios');
      const snapshot = await get(usuariosRef);

      if (snapshot.exists()) {
        const dados = snapshot.val();
        const usuarioValido = Object.values(dados).find(
          (user) => user.email === email && user.senha === senha
        );
        if (usuarioValido) {
          alert('Login realizado com sucesso!');
          navigate('/painel');
        } else {
          alert('E-mail ou senha inválidos.');
        }
      } else {
        alert('Nenhum usuário encontrado no sistema.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao tentar login. Tente novamente.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-glass">
        <img src={Logo} alt="Comunica Quest" className="login-logo" style={{ width: '300px', marginLeft: '-20px', marginBottom: '0px' }} />
        <h2 className="login-title">Bem-vindo(a) 👋</h2>
        <p className="login-subtitle">Acesse sua conta institucional</p>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type="password"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>

        <div className="login-links">
          <Link to="/RecuperarSenha">Esqueceu a senha?</Link>
          <span>•</span>
          <Link to="/registro">Criar conta</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
