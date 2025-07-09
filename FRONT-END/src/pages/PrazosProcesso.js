import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../public/logo.png";
import "../style/agenda.css";
import "../style/global.css";
import { Link, useParams, useNavigate } from 'react-router-dom';

const PrazosProcesso = () => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    const { oab, num_processo } = useParams();
    const navigate = useNavigate();
    
    // State management
    const [busca, setBusca] = useState("");
    const [prazos, setPrazos] = useState([]);
    const [processos, setProcessos] = useState([]);
    const [processoSelecionado, setProcessoSelecionado] = useState(null);
    const [prazoSelecionado, setPrazoSelecionado] = useState(null);
    const [mostrarProcessos, setMostrarProcessos] = useState(false);
    const [mostrarAdd, setMostrarAdd] = useState(false);
    const [mostrarEdit, setMostrarEdit] = useState(false);
    const [mostrarInfo, setMostrarInfo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Form data
    const [formData, setFormData] = useState({
        num_processo: num_processo || '',
        nome_prapro: '',
        data_prapro: '',
        descritao_prapro: '',
        status_prapro: 'pendente'
    });

    // Helper functions
    const formatarData = (dataString) => {
        if (!dataString) return '';
        try {
            return new Date(dataString).toLocaleDateString();
        } catch {
            return dataString;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // CRUD operations
    const listarPrazos = async () => {
        try {
            setLoading(true);
            const endpoint = num_processo 
                ? `${API_BASE_URL}/advogados/${oab}/Prazo/${num_processo}`
                : `${API_BASE_URL}/advogados/${oab}/Prazo`;
            const response = await axios.get(endpoint);
            setPrazos(response.data);
        } catch (error) {
            setError("Erro ao carregar prazos");
            console.error("Erro ao buscar prazos:", error);
        } finally {
            setLoading(false);
        }
    };

    const listarProcessos = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/advogados/${oab}/Processos`);
            setProcessos(response.data);
        } catch (error) {
            console.error("Erro ao buscar processos:", error);
        }
    };

    const criarPrazo = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!formData.num_processo || !formData.data_prapro || !formData.nome_prapro) {
                throw new Error("Preencha todos os campos obrigatórios");
            }

            await axios.post(`${API_BASE_URL}/advogados/${oab}/Prazo`, formData);
            alert("Prazo cadastrado com sucesso!");
            
            // Reset form and update list
            setFormData({
                num_processo: num_processo || '',
                nome_prapro: '',
                data_prapro: '',
                descritao_prapro: '',
                status_prapro: 'pendente'
            });
            
            setMostrarAdd(false);
            listarPrazos();
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    const editarPrazo = async (e) => {
        e.preventDefault();
        if (!window.confirm("Confirmar alterações?")) return;
        
        setLoading(true);
        setError(null);
        
        try {
            await axios.put(
                `${API_BASE_URL}/advogados/${oab}/Prazo/${prazoSelecionado.cod_prapro}`,
                formData
            );
            
            alert("Prazo editado com sucesso!");
            setMostrarEdit(false);
            listarPrazos();
        } catch (err) {
            setError(err.response?.data?.error || "Erro ao editar prazo");
        } finally {
            setLoading(false);
        }
    };

    const deletarPrazo = async (cod_prapro) => {
        if (!window.confirm("Tem certeza que deseja excluir este prazo?")) return;
        
        try {
            await axios.delete(`${API_BASE_URL}/advogados/${oab}/Prazo/${cod_prapro}`);
            alert("Prazo excluído com sucesso!");
            setMostrarInfo(false);
            listarPrazos();
        } catch (error) {
            alert(error.response?.data?.error || "Erro ao excluir prazo");
        }
    };

    // Effects
    useEffect(() => {
        listarPrazos();
        listarProcessos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [oab, num_processo]);

    useEffect(() => {
        if (mostrarEdit && prazoSelecionado) {
            const dataFormatada = prazoSelecionado.data_prapro 
                ? new Date(prazoSelecionado.data_prapro).toISOString().split('T')[0]
                : '';
                
            setFormData({
                num_processo: prazoSelecionado.num_processo || '',
                nome_prapro: prazoSelecionado.nome_prapro || '',
                data_prapro: dataFormatada,
                descritao_prapro: prazoSelecionado.descritao_prapro || '',
                status_prapro: prazoSelecionado.status_prapro || 'pendente'
            });
        }
    }, [prazoSelecionado, mostrarEdit]);

    // Filtering
    const prazosFiltrados = prazos.filter(prazo => {
        const buscaLower = busca.toLowerCase();
        return (
            prazo.nome_prapro?.toLowerCase().includes(buscaLower) ||
            prazo.descritao_prapro?.toLowerCase().includes(buscaLower) ||
            prazo.status_prapro?.toLowerCase().includes(buscaLower) ||
            prazo.num_processo?.toString().includes(busca) ||
            prazo.data_prapro?.toString().includes(busca)
        );
    });

    // Render
    return (
        <div className="container">
            <header className="central">
                <Link to="/advogados"><img src={logo} alt="logo" /></Link>
                <Link to="/advogados"><h1>ADVOCACIA ALMEIDA</h1></Link>

                <nav>
                    <button className="agenda" onClick={() => navigate(`/advogados/${oab}/Agenda`)}>AGENDA</button>
                    <button className="contratos" onClick={() => navigate(`/advogados/${oab}/Contratos`)}>CONTRATOS</button>
                    <button className="processos" onClick={() => navigate(`/advogados/${oab}/Processos`)}>PROCESSOS</button>
                    <button className="pagamentos" onClick={() => navigate(`/advogados/${oab}/Pagamentos`)}>PAGAMENTOS</button>
                    <button className="clientes" onClick={() => navigate(`/advogados/${oab}/Clientes`)}>CLIENTES</button>
                </nav>
            </header>

            <main className="main-agenda">
                <div className="buscar-add">
                    <input
                        type="text"
                        placeholder="Buscar"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                    <button onClick={() => navigate(`/advogados/${oab}/Agenda`)}>AGENDA</button>
                    <button onClick={() => setMostrarProcessos(true)}>ADICIONAR</button>
                </div>

                {error && <div className="error-message">{error}</div>}
                {loading && <div className="loading">Carregando...</div>}

                <ul className="ul-comp">
                    {prazosFiltrados.map((prazo) => (
                        <li className="li-prazo" key={prazo.cod_prapro}>
                            <button onClick={() => {
                                setPrazoSelecionado(prazo);
                                setMostrarInfo(true);
                            }}>
                                <p className="data">{formatarData(prazo.data_prapro)}</p>
                                <p>{prazo.nome_prapro}</p><hr/>
                                <p>{prazo.status_prapro}</p>
                            </button>
                        </li>
                    ))}
                </ul>
                
                {/* Info Modal */}
                {mostrarInfo && prazoSelecionado && (
                    <div className="aba-comp">
                        <h3>PRAZO DO PROCESSO</h3>
                        <div className="info">
                            <div className="inputers">
                                <div className="basicoc">
                                    <label>
                                        NOME DO PRAZO <br/>
                                    <input value={prazoSelecionado.nome_prapro} readOnly />
                                    </label>
                                    <label>
                                        NUMERO DO PROCESSO <br/>
                                    <input value={prazoSelecionado.num_processo} readOnly />
                                    </label>
                                    
                                </div>
                                <div className="dadosc">
                                    <label>
                                        DATA DO PRAZO <br/>
                                    <input value={formatarData(prazoSelecionado.data_prapro)} readOnly />
                                    </label>
                                    <label>
                                        STATUS DO PRAZO <br/>
                                    <input value={prazoSelecionado.status_prapro} readOnly />
                                    </label>
                                </div>
                            </div>
                            <label>
                                DESCRIÇÃO <br/>
                            <textarea value={prazoSelecionado.descritao_prapro} readOnly />
                            </label>
                        </div>
                        <div className="botoes">
                            <button className="editar" onClick={() => {
                                setMostrarEdit(true);
                                setMostrarInfo(false);
                            }}>EDITAR</button>
                            <button className="voltar" onClick={() => setMostrarInfo(false)}>VOLTAR</button>
                            <button className="excluir" onClick={() => deletarPrazo(prazoSelecionado.cod_prapro)}>EXCLUIR</button>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {mostrarEdit && prazoSelecionado && (
                    <div className="aba-edit-comp">
                        <h3>EDITAR PRAZO</h3>
                        <form onSubmit={editarPrazo}>
                            <div className="campos">
                                <label>
                                    Número do Processo
                                    <input name="num_processo" value={formData.num_processo} readOnly />
                                </label>
                                <label>
                                    Nome do Prazo
                                    <input 
                                        type="text" 
                                        name="nome_prapro" 
                                        onChange={handleChange} 
                                        value={formData.nome_prapro} 
                                        required 
                                    />
                                </label>
                                <label>
                                    Data
                                    <input 
                                        type="date" 
                                        name="data_prapro" 
                                        onChange={handleChange} 
                                        value={formData.data_prapro} 
                                        required 
                                    />
                                </label>
                                <label>
                                    Status
                                    <select 
                                        name="status_prapro" 
                                        onChange={handleChange} 
                                        value={formData.status_prapro} 
                                        required
                                    >
                                        <option value="">SELECIONE</option>
                             <option value="pendente">pendente</option>
                             <option value="remarcado">REMARCADO</option>
                             <option value="perdido">PERDIDO</option>
                             <option value="cancelado">CANCELADO</option>
                                    </select>
                                </label>
                            </div>
                            <textarea 
                                className="descricao" 
                                name="descritao_prapro" 
                                onChange={handleChange} 
                                value={formData.descritao_prapro} 
                                placeholder="Descrição do prazo" 
                            />
                            <div className="botoes">
                                <button 
                                    className="voltar" 
                                    type="button" 
                                    onClick={() => setMostrarEdit(false)}
                                >
                                    VOLTAR
                                </button>
                                {error && <div className="error-message">{error}</div>}
                                <button className="salvar" type="submit" disabled={loading}>
                                    {loading ? "SALVANDO..." : "SALVAR"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Process Selection Modal */}
                {mostrarProcessos && (
                    <div className="aba-contrato-compromisso">
                        <h3>SELECIONE O PROCESSO</h3>
                        <table className="table-pross">
                            <thead>
                                <tr>
                                    <th>Cód. Contrato</th>
                                    <th>Nome</th>
                                    <th>CPF</th>
                                    <th>Tipo de Serviço</th>
                                    <th>Nº Processo</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processos.map((processo) => (                       
                                    <tr 
                                        key={processo.num_processo} 
                                        onClick={() => {
                                            setMostrarAdd(true);
                                            setProcessoSelecionado(processo);
                                            setFormData(prev => ({
                                                ...prev,
                                                num_processo: processo.num_processo
                                            }));
                                            setMostrarProcessos(false);
                                        }}
                                    >
                                        <td>{processo.cod_contrato}</td>
                                        <td>{processo.nome}</td>
                                        <td>{processo.CPF}</td>
                                        <td>{processo.tipo_servico}</td>
                                        <td>{processo.num_processo}</td>
                                        <td>{processo.status_processo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="botoes">
                            <button 
                                className="voltar" 
                                onClick={() => setMostrarProcessos(false)}
                            >
                                VOLTAR
                            </button>
                        </div>
                    </div>
                )}

                {/* Add Modal */}
                {mostrarAdd && processoSelecionado && (
                    <div className="aba-add-compromisso">
                        <h3>ADICIONAR PRAZO</h3>
                        <form onSubmit={criarPrazo}>
                            <div className="campos">
                                <label>
                                    Número do Processo
                                    <input 
                                        name="num_processo" 
                                        value={formData.num_processo} 
                                        readOnly 
                                    />
                                </label>
                                <label>
                                    Nome do Prazo
                                    <input 
                                        type="text" 
                                        name="nome_prapro" 
                                        onChange={handleChange} 
                                        value={formData.nome_prapro} 
                                        required 
                                    />
                                </label>
                                <label>
                                    Data
                                    <input 
                                        type="date" 
                                        name="data_prapro" 
                                        onChange={handleChange} 
                                        value={formData.data_prapro} 
                                        required 
                                        min={new Date().toISOString().split('T')[0]} // Não permite datas passadas
                                    />
                                </label>
                                <label>
                                    Status
                                    <select 
                                        name="status_prapro" 
                                        onChange={handleChange} 
                                        value={formData.status_prapro} 
                                        required
                                    >
                                        <option value="">SELECIONE</option>
                             <option value="pendente">pendente</option>
                             <option value="remarcado">REMARCADO</option>
                             <option value="perdido">PERDIDO</option>
                             <option value="cancelado">CANCELADO</option>
                                    </select>
                                </label>
                            </div>
                            <textarea 
                                className="descricao" 
                                name="descritao_prapro" 
                                onChange={handleChange} 
                                value={formData.descritao_prapro} 
                                placeholder="Descrição do prazo" 
                            />
                            <div className="botoes">
                                <button 
                                    className="voltar" 
                                    type="button" 
                                    onClick={() => {
                                        setMostrarAdd(false);
                                        setMostrarProcessos(true);
                                    }}
                                >
                                    VOLTAR
                                </button>
                                {error && <div className="error-message">{error}</div>}
                                <button 
                                    className="salvar" 
                                    type="submit" 
                                    disabled={loading}
                                >
                                    {loading ? "SALVANDO..." : "SALVAR"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PrazosProcesso;