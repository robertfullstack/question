import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { ref, get, set, remove } from 'firebase/database';
import '../styles/Painel.css';

const userId = 'user123'; // ID fixo só para exemplo. Use o ID real do usuário logado!

const Painel = () => {
    const [abaAtiva, setAbaAtiva] = useState('progresso');
    const [questoes, setQuestoes] = useState([]);
    const [favoritos, setFavoritos] = useState({}); // armazenar IDs favoritos do user

    // Carrega questões e favoritos do usuário
    useEffect(() => {
        if (abaAtiva === 'questoes' || abaAtiva === 'favoritos') {
            // Buscar questões
            const questoesRef = ref(db, 'questoes');
            get(questoesRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const dados = snapshot.val();
                    const lista = Object.entries(dados).map(([id, questao]) => ({
                        id,
                        ...questao
                    }));
                    setQuestoes(lista);
                } else {
                    setQuestoes([]);
                }
            });

            // Buscar favoritos do usuário
            const favRef = ref(db, `favoritos/${userId}`);
            get(favRef).then((snapshot) => {
                if (snapshot.exists()) {
                    setFavoritos(snapshot.val());
                } else {
                    setFavoritos({});
                }
            });
        }
    }, [abaAtiva]);

    // Marcar ou desmarcar favorito
    const toggleFavorito = (questaoId) => {
        const favRef = ref(db, `favoritos/${userId}/${questaoId}`);

        if (favoritos && favoritos[questaoId]) {
            // Já é favorito -> remover
            remove(favRef)
                .then(() => {
                    setFavoritos((prev) => {
                        const copia = { ...prev };
                        delete copia[questaoId];
                        return copia;
                    });
                })
                .catch((err) => {
                    alert('Erro ao remover favorito');
                    console.error(err);
                });
        } else {
            // Não é favorito -> adicionar
            set(favRef, true)
                .then(() => {
                    setFavoritos((prev) => ({ ...prev, [questaoId]: true }));
                })
                .catch((err) => {
                    alert('Erro ao adicionar favorito');
                    console.error(err);
                });
        }
    };

    const renderConteudo = () => {
        switch (abaAtiva) {
            case 'progresso':
                return <div className="conteudo">📈 Progresso do aluno aparecerá aqui.</div>;

            case 'favoritos':
                return (
                    <div className="conteudo">
                        <h3>⭐ Suas Questões Favoritas</h3>
                        {Object.keys(favoritos).length > 0 ? (
                            <ul className="lista-questoes">
                                {questoes
                                    .filter((q) => favoritos[q.id])
                                    .map((q) => (
                                        <QuestaoComResposta
                                            key={q.id}
                                            questao={q}
                                            favorito={favoritos[q.id]}
                                            toggleFavorito={() => toggleFavorito(q.id)}
                                        />
                                    ))}
                            </ul>
                        ) : (
                            <p>Você não tem questões favoritas ainda.</p>
                        )}
                    </div>
                );

            case 'historico':
                return <div className="conteudo">🕓 Histórico de questões resolvidas.</div>;

            case 'questoes':
                return (
                    <div className="conteudo">
                        <h3>📚 Questões Disponíveis</h3>
                        {questoes.length > 0 ? (
                            <ul className="lista-questoes">
                                {questoes.map((q) => (
                                    <QuestaoComResposta
                                        key={q.id}
                                        questao={q}
                                        favorito={favoritos[q.id]}
                                        toggleFavorito={() => toggleFavorito(q.id)}
                                    />
                                ))}
                            </ul>
                        ) : (
                            <p>Nenhuma questão cadastrada.</p>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="painel-container">
            <aside className="menu-lateral">
                <h2 className="logo">Questões+</h2>
                <nav>
                    <button
                        onClick={() => setAbaAtiva('progresso')}
                        className={abaAtiva === 'progresso' ? 'ativo' : ''}
                    >
                        Progresso
                    </button>
                    <button
                        onClick={() => setAbaAtiva('favoritos')}
                        className={abaAtiva === 'favoritos' ? 'ativo' : ''}
                    >
                        Favoritos
                    </button>
                    <button
                        onClick={() => setAbaAtiva('historico')}
                        className={abaAtiva === 'historico' ? 'ativo' : ''}
                    >
                        Histórico
                    </button>
                    <button
                        onClick={() => setAbaAtiva('questoes')}
                        className={abaAtiva === 'questoes' ? 'ativo' : ''}
                    >
                        Questões
                    </button>
                </nav>
            </aside>
            <main className="painel-conteudo">{renderConteudo()}</main>
        </div>
    );
};

// ... (todo o código permanece igual até o componente QuestaoComResposta)

const QuestaoComResposta = ({ questao, favorito, toggleFavorito }) => {
    const [respostaSelecionada, setRespostaSelecionada] = useState(null);
    const [mostrarResultado, setMostrarResultado] = useState(false);

    const handleRespostaClick = (index) => {
        if (mostrarResultado) return; // evita mudar resposta depois de mostrar resultado
        setRespostaSelecionada(index);
        setMostrarResultado(true);
    };

    const correta = questao.correta; // índice da resposta correta

    return (
        <li className="questao-item" style={{ marginBottom: '20px' }}>
            <strong>{questao.pergunta}</strong>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {questao.respostas?.map((res, idx) => {
                    let style = {
                        cursor: mostrarResultado ? 'default' : 'pointer',
                        padding: '6px 10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        marginBottom: '6px',
                        userSelect: 'none',
                    };

                    if (mostrarResultado) {
                        if (idx === correta) {
                            style.backgroundColor = '#d4edda'; // verde claro
                            style.borderColor = '#28a745';
                            style.fontWeight = 'bold';
                        }
                        if (idx === respostaSelecionada && idx !== correta) {
                            style.backgroundColor = '#f8d7da'; // vermelho claro
                            style.borderColor = '#dc3545';
                            style.fontWeight = 'bold';
                        }
                    } else if (idx === respostaSelecionada) {
                        style.backgroundColor = '#cce5ff'; // azul claro seleção
                    }

                    // Corrigir exibição caso res seja objeto
                    const textoResposta = typeof res === 'object' && res !== null ? res.texto : res;

                    return (
                        <li
                            key={idx}
                            style={style}
                            onClick={() => handleRespostaClick(idx)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleRespostaClick(idx);
                            }}
                        >
                            {textoResposta}
                        </li>
                    );
                })}
            </ul>

            <button
                className={`btn-fav ${favorito ? 'ativo' : ''}`}
                onClick={toggleFavorito}
                aria-label={favorito ? 'Desmarcar favorito' : 'Marcar favorito'}
            >
                {favorito ? '⭐' : '☆'}
            </button>

            {mostrarResultado && (
                <p style={{ marginTop: '8px', fontWeight: 'bold' }}>
                    {respostaSelecionada === correta ? (
                        <span style={{ color: 'green' }}>✅ Resposta correta!</span>
                    ) : (
                        <span style={{ color: 'red' }}>❌ Resposta incorreta.</span>
                    )}
                </p>
            )}
        </li>
    );
};


export default Painel;
