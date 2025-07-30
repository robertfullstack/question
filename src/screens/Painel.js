import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { ref, get, set, remove, push, onValue } from 'firebase/database';
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
    const [alternativasEliminadas, setAlternativasEliminadas] = useState([]);

    // Comentários
    const [comentario, setComentario] = useState('');
    const [comentarios, setComentarios] = useState([]);
    const [mostrarComentarios, setMostrarComentarios] = useState(false); // 👈 novo estado

    const correta = questao.correta;

    useEffect(() => {
        const comentariosRef = ref(db, `comentarios/${questao.id}`);
        const unsubscribe = onValue(comentariosRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const lista = Object.entries(data).map(([id, c]) => ({ id, ...c }));
                setComentarios(lista.reverse());
            } else {
                setComentarios([]);
            }
        });

        return () => unsubscribe();
    }, [questao.id]);

    const enviarComentario = () => {
        if (comentario.trim() === '') return;

        const novoComentario = {
            texto: comentario.trim(),
            autor: 'Aluno',
            timestamp: Date.now()
        };

        const comentariosRef = ref(db, `comentarios/${questao.id}`);
        push(comentariosRef, novoComentario)
            .then(() => setComentario(''))
            .catch((err) => {
                console.error('Erro ao enviar comentário:', err);
            });
    };

    const handleRespostaClick = (index) => {
        if (mostrarResultado || alternativasEliminadas.includes(index)) return;
        setRespostaSelecionada(index);
    };

    const eliminarAlternativa = (index) => {
        if (mostrarResultado || alternativasEliminadas.includes(index)) return;
        setAlternativasEliminadas((prev) => [...prev, index]);
    };

    const responder = () => {
        if (respostaSelecionada !== null) {
            setMostrarResultado(true);
        }
    };

    return (
        <li className="questao-item" style={{ marginBottom: '20px' }}>
            <strong>{questao.pergunta}</strong>

            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {questao.respostas?.map((res, idx) => {
                    const eliminada = alternativasEliminadas.includes(idx);
                    const selecionada = idx === respostaSelecionada;

                    let style = {
                        cursor: mostrarResultado || eliminada ? 'default' : 'pointer',
                        padding: '6px 10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        marginBottom: '6px',
                        userSelect: 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: selecionada ? '#cce5ff' : '#fff',
                        textDecoration: eliminada ? 'line-through' : 'none',
                        opacity: eliminada ? 0.6 : 1,
                        pointerEvents: eliminada ? 'none' : 'auto'
                    };

                    if (mostrarResultado) {
                        if (idx === correta) {
                            style.backgroundColor = '#d4edda';
                            style.borderColor = '#28a745';
                            style.fontWeight = 'bold';
                        } else if (selecionada && idx !== correta) {
                            style.backgroundColor = '#f8d7da';
                            style.borderColor = '#dc3545';
                            style.fontWeight = 'bold';
                        }
                    }

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
                            <span>{textoResposta}</span>
                            {!mostrarResultado && !eliminada && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        eliminarAlternativa(idx);
                                    }}
                                    className="btn-tesoura"
                                    title="Eliminar alternativa"
                                    style={{
                                        marginLeft: '10px',
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '16px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    ✂️
                                </button>
                            )}
                        </li>
                    );
                })}
            </ul>

            {!mostrarResultado && respostaSelecionada !== null && (
                <button
                    onClick={responder}
                    className="btn-responder"
                    style={{
                        backgroundColor: '#28a745',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}
                >
                    Responder
                </button>
            )}

            <button
                className={`btn-fav ${favorito ? 'ativo' : ''}`}
                onClick={toggleFavorito}
                aria-label={favorito ? 'Desmarcar favorito' : 'Marcar favorito'}
                style={{
                    marginLeft: '10px',
                    marginTop: '10px',
                    backgroundColor: '#ffc107',
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
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

            {/* Botão para mostrar/ocultar comentários */}
            <button
                onClick={() => setMostrarComentarios((prev) => !prev)}
                style={{
                    marginTop: '14px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                {mostrarComentarios ? 'Ocultar Comentários' : 'Ver Comentários'}
            </button>

            {/* Comentários visíveis só se mostrarComentarios for true */}
            {mostrarComentarios && (
                <div style={{ marginTop: '16px' }}>
                    <h4 style={{ marginBottom: '6px' }}>💬 Comentários</h4>

                    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                        {comentarios.map((c) => (
                            <li key={c.id} style={{ marginBottom: '6px', backgroundColor: '#f0f0f0', padding: '6px', borderRadius: '4px' }}>
                                <strong>{c.autor}</strong>: {c.texto}
                            </li>
                        ))}
                    </ul>

                    <div style={{ display: 'flex', marginTop: '8px', gap: '6px' }}>
                        <input
                            type="text"
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            placeholder="Escreva um comentário..."
                            style={{
                                flex: 1,
                                padding: '6px',
                                borderRadius: '4px',
                                border: '1px solid #ccc'
                            }}
                        />
                        <button
                            onClick={enviarComentario}
                            style={{
                                backgroundColor: '#007bff',
                                color: '#fff',
                                border: 'none',
                                padding: '6px 10px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            )}
        </li>
    );
};



export default Painel;
