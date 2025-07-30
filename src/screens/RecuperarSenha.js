// src/screens/RecuperarSenha.jsx
import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Home.css'; // Ou crie um estilo próprio

export const RecuperarSenha = () => {
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
        <div className="login-page">
            <ToastContainer />
            <div className="login-box">
                <h2 className="login-title">Recuperar Senha</h2>
                <form className="login-form" onSubmit={handleRecuperarSenha}>
                    <label htmlFor="email">E-mail cadastrado</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="ex: aluno@escola.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Enviar Link</button>
                </form>
            </div>
        </div>
    );
};

export default RecuperarSenha;
