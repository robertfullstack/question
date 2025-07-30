import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import '../styles/Home.css'; // mesmo CSS da tela de login
import Logo from '../images/WhatsApp_Image_2025-07-24_at_10.53.57-removebg-preview.png'; // mesma logo

const RecuperarSenha = () => {
    const [email, setEmail] = useState('');

    const handleRecuperarSenha = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error('Por favor, insira um e-mail válido.');
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            toast.success('Link de redefinição enviado para seu e-mail!');
            setEmail('');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao enviar link. Verifique o e-mail informado.');
        }
    };

    return (
        <div className="login-container">
            <ToastContainer />
            <div className="login-glass">
                <img src={Logo} alt="Comunica Quest" className="login-logo" />
                <h2 className="login-title">Recuperar Senha</h2>
                <p className="login-subtitle">Informe seu e-mail institucional</p>

                <form className="login-form" onSubmit={handleRecuperarSenha}>
                    <div className="input-group">
                        <FiMail className="input-icon" />
                        <input
                            type="email"
                            placeholder="E-mail cadastrado"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Enviar Link
                    </button>
                </form>

                <div className="login-links">
                    <p>
                        Lembrou a senha? <Link to="/">Voltar ao login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RecuperarSenha;
