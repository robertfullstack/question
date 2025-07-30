import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { ref, get, remove, update, push } from 'firebase/database';
import '../styles/PainelAdmin.css';

const PainelAdmin = () => {
    const [abaAtiva, setAbaAtiva] = useState('questoes');

    // Estados para edição de questões
    const [editandoQuestaoId, setEditandoQuestaoId] = useState(null);
    const [formQuestao, setFormQuestao] = useState({ pergunta: '', respostas: [''], correta: null });

    // Estados para usuários
    const [usuarios, setUsuarios] = useState([]);
    const [editando, setEditando] = useState(null);
    const [formData, setFormData] = useState({ nome: '', email: '', senha: '' });

    // Estados para nova questão
    const [pergunta, setPergunta] = useState('');
    const [respostas, setRespostas] = useState(['']);
    const [correta, setCorreta] = useState(null);
    const [questoes, setQuestoes] = useState([]);

    // Buscar usuários do Firebase
    const buscarUsuarios = () => {
        const usuariosRef = ref(db, 'usuarios');
        get(usuariosRef).then((snapshot) => {
            if (snapshot.exists()) {
                const dados = snapshot.val();
                const lista = Object.entries(dados).map(([id, usuario]) => ({
                    id,
                    ...usuario,
                }));
                setUsuarios(lista);
            } else {
                setUsuarios([]);
            }
        });
    };

    // Buscar questões do Firebase
    const carregarQuestoes = () => {
        const refQuestoes = ref(db, 'questoes');
        get(refQuestoes).then((snap) => {
            if (snap.exists()) {
                const dados = snap.val();
                const lista = Object.entries(dados).map(([id, questao]) => ({
                    id,
                    ...questao,
                }));
                setQuestoes(lista);
            } else {
                setQuestoes([]);
            }
        });
    };

    useEffect(() => {
        if (abaAtiva === 'usuarios') buscarUsuarios();
        if (abaAtiva === 'questoes') carregarQuestoes();
    }, [abaAtiva]);

    // Remover usuário
    const excluirUsuario = (id) => {
        const usuarioRef = ref(db, `usuarios/${id}`);
        remove(usuarioRef)
            .then(() => {
                alert('Usuário removido com sucesso.');
                buscarUsuarios();
            })
            .catch((err) => {
                console.error('Erro ao excluir:', err);
                alert('Erro ao excluir usuário.');
            });
    };

    // Editar usuário
    const editarUsuario = (usuario) => {
        setEditando(usuario.id);
        setFormData({
            nome: usuario.nome,
            email: usuario.email,
            senha: usuario.senha,
        });
    };

    const salvarEdicao = () => {
        const usuarioRef = ref(db, `usuarios/${editando}`);
        update(usuarioRef, formData)
            .then(() => {
                alert('Usuário atualizado.');
                setEditando(null);
                buscarUsuarios();
            })
            .catch((err) => {
                console.error('Erro ao atualizar:', err);
                alert('Erro ao salvar edição.');
            });
    };

    // Questões
    const adicionarResposta = () => {
        setRespostas([...respostas, '']);
    };

    const atualizarResposta = (index, valor) => {
        const novas = [...respostas];
        novas[index] = valor;
        setRespostas(novas);
    };

    const salvarQuestao = () => {
        if (!pergunta.trim()) {
            alert('Digite a pergunta.');
            return;
        }

        const respostasValidas = respostas.filter((r) => r.trim() !== '');

        if (respostasValidas.length < 2) {
            alert('Adicione pelo menos 2 respostas.');
            return;
        }

        if (correta === null || correta >= respostasValidas.length) {
            alert('Selecione a resposta correta.');
            return;
        }

        const questoesRef = ref(db, 'questoes');
        const novaQuestao = {
            pergunta,
            respostas: respostasValidas,
            correta,
        };

        push(questoesRef, novaQuestao)
            .then(() => {
                alert('Questão salva com sucesso!');
                setPergunta('');
                setRespostas(['']);
                setCorreta(null);
                carregarQuestoes();
            })
            .catch((err) => {
                console.error('Erro ao salvar questão:', err);
            });
    };

    // Iniciar edição de questão existente
    const iniciarEdicaoQuestao = (questao) => {
        setEditandoQuestaoId(questao.id);
        setFormQuestao({
            pergunta: questao.pergunta,
            respostas: questao.respostas.length ? questao.respostas : [''],
            correta: questao.correta ?? null,
        });
    };

    const cancelarEdicaoQuestao = () => {
        setEditandoQuestaoId(null);
        setFormQuestao({ pergunta: '', respostas: [''], correta: null });
    };

    const salvarEdicaoQuestao = (id) => {
        if (!formQuestao.pergunta.trim()) {
            alert('Digite a pergunta.');
            return;
        }

        const respostasValidas = formQuestao.respostas.filter((r) => r.trim() !== '');

        if (respostasValidas.length < 2) {
            alert('Adicione pelo menos 2 respostas.');
            return;
        }

        if (formQuestao.correta === null || formQuestao.correta >= respostasValidas.length) {
            alert('Selecione a resposta correta.');
            return;
        }

        const refQuestao = ref(db, `questoes/${id}`);
        const atualizacao = {
            pergunta: formQuestao.pergunta,
            respostas: respostasValidas,
            correta: formQuestao.correta,
        };

        update(refQuestao, atualizacao)
            .then(() => {
                alert('Questão atualizada com sucesso!');
                setEditandoQuestaoId(null);
                setFormQuestao({ pergunta: '', respostas: [''], correta: null });
                carregarQuestoes();
            })
            .catch((err) => {
                console.error('Erro ao atualizar questão:', err);
                alert('Erro ao atualizar questão.');
            });
    };

    const excluirQuestao = (id) => {
        const refQuestao = ref(db, `questoes/${id}`);
        if (window.confirm('Tem certeza que deseja excluir esta questão?')) {
            remove(refQuestao)
                .then(() => {
                    alert('Questão excluída.');
                    carregarQuestoes();
                })
                .catch((err) => {
                    console.error('Erro ao excluir questão:', err);
                });
        }
    };

    // Atualizar resposta no formulário de edição
    const atualizarRespostaEditando = (index, valor) => {
        const novas = [...formQuestao.respostas];
        novas[index] = valor;
        setFormQuestao({ ...formQuestao, respostas: novas });
    };

    // Adicionar resposta no formulário de edição
    const adicionarRespostaEditando = () => {
        setFormQuestao({ ...formQuestao, respostas: [...formQuestao.respostas, ''] });
    };

    return (
        <div className="admin-container">
            <aside className="admin-menu">
                <h2>Painel Admin</h2>
                <button
                    onClick={() => setAbaAtiva('questoes')}
                    className={abaAtiva === 'questoes' ? 'ativo' : ''}
                >
                    Questões
                </button>
                <button
                    onClick={() => setAbaAtiva('usuarios')}
                    className={abaAtiva === 'usuarios' ? 'ativo' : ''}
                >
                    Usuários cadastrados
                </button>
            </aside>

            <main className="admin-conteudo">
                {abaAtiva === 'questoes' && (
                    <div>
                        <h3>📚 Área de Questões</h3>

                        <div className="form-questao">
                            <label>Pergunta:</label>
                            <input
                                type="text"
                                value={pergunta}
                                onChange={(e) => setPergunta(e.target.value)}
                                placeholder="Digite a pergunta"
                            />

                            <label>Respostas:</label>
                            {respostas.map((resposta, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                    <input
                                        type="radio"
                                        name="correta"
                                        checked={correta === index}
                                        onChange={() => setCorreta(index)}
                                    />
                                    <input
                                        type="text"
                                        value={resposta}
                                        placeholder={`Resposta ${index + 1}`}
                                        onChange={(e) => atualizarResposta(index, e.target.value)}
                                    />
                                </div>
                            ))}
                            <button onClick={adicionarResposta}>+ Adicionar Resposta</button>
                            <button onClick={salvarQuestao}>Salvar Questão</button>
                        </div>

                        <h4>📋 Questões Cadastradas:</h4>
                        <ul className="lista-questoes">
                            {questoes.map((q, i) => (
                                <li key={q.id || i}>
                                    {editandoQuestaoId === q.id ? (
                                        <div className="form-questao">
                                            <label>Editar pergunta:</label>
                                            <input
                                                type="text"
                                                value={formQuestao.pergunta}
                                                onChange={(e) =>
                                                    setFormQuestao({ ...formQuestao, pergunta: e.target.value })
                                                }
                                            />

                                            <label>Respostas:</label>
                                            {formQuestao.respostas.map((resposta, idx) => (
                                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                                    <input
                                                        type="radio"
                                                        name="editCorreta"
                                                        checked={formQuestao.correta === idx}
                                                        onChange={() =>
                                                            setFormQuestao({ ...formQuestao, correta: idx })
                                                        }
                                                    />
                                                    <input
                                                        type="text"
                                                        value={resposta}
                                                        placeholder={`Resposta ${idx + 1}`}
                                                        onChange={(e) => atualizarRespostaEditando(idx, e.target.value)}
                                                    />
                                                </div>
                                            ))}
                                            <button onClick={adicionarRespostaEditando}>+ Adicionar Resposta</button>
                                            <button onClick={() => salvarEdicaoQuestao(q.id)}>Salvar</button>
                                            <button onClick={cancelarEdicaoQuestao}>Cancelar</button>
                                        </div>
                                    ) : (
                                        <>
                                            <strong>{q.pergunta}</strong>
                                            <ul>
                                                {q.respostas.map((r, ri) => (
                                                    <li
                                                        key={ri}
                                                        style={{
                                                            listStyle: q.correta === ri ? 'disc' : 'circle',
                                                            fontWeight: q.correta === ri ? 'bold' : 'normal',
                                                        }}
                                                    >
                                                        {typeof r === 'object' ? r.texto : r}
                                                        {q.correta === ri && ' (Correta)'}
                                                    </li>
                                                ))}
                                            </ul>

                                            <div className="acoes">
                                                <button onClick={() => iniciarEdicaoQuestao(q)}>✏️ Editar</button>
                                                <button onClick={() => excluirQuestao(q.id)}>🗑️ Excluir</button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {abaAtiva === 'usuarios' && (
                    <div>
                        <h3>👥 Usuários Cadastrados</h3>
                        {usuarios.length > 0 ? (
                            <ul className="usuarios-lista">
                                {usuarios.map((user) => (
                                    <li key={user.id}>
                                        {editando === user.id ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={formData.nome}
                                                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                                />
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                                <input
                                                    type="text"
                                                    value={formData.senha}
                                                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                                                />
                                                <button onClick={salvarEdicao}>Salvar</button>
                                                <button onClick={() => setEditando(null)}>Cancelar</button>
                                            </>
                                        ) : (
                                            <>
                                                <strong>{user.nome}</strong>
                                                <br />
                                                <span>{user.email}</span>
                                                <div className="acoes">
                                                    <button onClick={() => editarUsuario(user)}>✏️ Editar</button>
                                                    <button onClick={() => excluirUsuario(user.id)}>🗑️ Excluir</button>
                                                </div>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Nenhum aluno cadastrado encontrado.</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default PainelAdmin;
