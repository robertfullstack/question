// src/screens/Admin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Admin.css';

const Admin = () => {
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        if (login === 'Deise' && senha === '25725') {
            navigate('/PainelAdmin');
        } else {
            alert('Login ou senha incorretos.');
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-box">
                <h2 className="admin-title">Login do Administrador</h2>
                <form className="admin-form" onSubmit={handleLogin}>
                    <label htmlFor="login">Login</label>
                    <input
                        type="text"
                        id="login"
                        placeholder=""
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        required
                    />

                    <label htmlFor="senha">Senha</label>
                    <input
                        type="password"
                        id="senha"
                        placeholder=""
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />

                    <button type="submit">Entrar</button>
                </form>
            </div>
        </div>
    );
};

export default Admin;
