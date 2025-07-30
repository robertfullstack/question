import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { ref, get } from 'firebase/database';
import '../styles/Home.css';

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
    <div className="login-page">
      <div className="login-box">
        <h2 className="login-title">Login do Aluno</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="email">E-mail institucional</label>
          <input
            type="email"
            id="email"
            placeholder="ex: aluno@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <button type="submit">Entrar</button>
        </form>

        <p className="forgot-password">
          Esqueceu a senha? <a href="/RecuperarSenha">Recuperar</a>
        </p>

        <p className="forgot-password">
          Não tem conta? <Link to="/registro">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
};

export default Home;
