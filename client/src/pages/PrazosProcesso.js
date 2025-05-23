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
    const [busca, setBusca] = useState("");
    const [prazos, setPrazos] = useState([]);
    const [processos, setProcessos] = useState([]);
    const [processoSelecionado, setProcessoSelecionado] = useState(null);
    const [mostrarInfo, setMostrarInfo] = useState(false);
    const [mostrarEdit, setMostrarEdit] = useState(false);
    const [mostrarAdd, setMostrarAdd] = useState(false);
    const [mostrarProcesso, setMostrarProcesso] = useState(false);
    const [prazoSelecionado, setPrazoSelecionado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        num_processo: '',
        nome_prapro: '',
        data_prapro: '',
        descritao_prapro: '',
        status_prapro: 'pendente'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const selecionarProcesso = (processo) => {
        setProcessoSelecionado(processo);
        setFormData(prev => ({
            ...prev,
            num_processo: processo.num_processo
        }));
        setMostrarAdd(true);
        setMostrarProcesso(false);
    };

    const criarPrazo = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            if (!formData.num_processo || !formData.data_prapro || !formData.nome_prapro) {
                throw new Error("Preencha todos os campos obrigatórios");
            }

            await axios.post(`${API_BASE_URL}/advogados/${oab}/Prazo`, formData);
            
            alert("Prazo cadastrado com sucesso!");
            setMostrarAdd(false);
            
            // Recarrega a lista
            const res = await axios.get(`${API_BASE_URL}/advogados/${oab}/Prazo`);
            setPrazos(res.data);
            
            // Reseta o formulário
            setFormData({
                num_processo: '',
                nome_prapro: '',
                data_prapro: '',
                descritao_prapro: '',
                status_prapro: 'pendente'
            });
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    const editarPrazo = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const dadosParaEnviar = {
                ...formData,
                data_prapro: new Date(formData.data_prapro).toISOString()
            };

            const response = await axios.put(
                `${API_BASE_URL}/advogados/${oab}/Prazo/${prazoSelecionado.cod_prapro}`,
                dadosParaEnviar
            );

            if (response.data.success) {
                alert("Prazo editado com sucesso!");
                setPrazos(prev => prev.map(item => 
                    item.cod_prapro === prazoSelecionado.cod_prapro 
                        ? { ...item, ...formData } 
                        : item
                ));
                setMostrarEdit(false);
            }
        } catch (err) {
            console.error("Erro detalhado:", err.response?.data);
            setError(err.response?.data?.error || "Erro ao editar prazo");
        } finally {
            setLoading(false);
        }
    };

    const deletarPrazo = async (cod_prapro) => {
        try {
            const confirmar = window.confirm("Tem certeza que deseja excluir este prazo?");
            if (!confirmar) return;

            const response = await axios.delete(`${API_BASE_URL}/advogados/${oab}/Prazo/${cod_prapro}`);

            if (response.status === 200) {
                alert("Prazo excluído com sucesso!");
                setMostrarInfo(false);
                setPrazos(prev => prev.filter(prazo => prazo.cod_prapro !== cod_prapro));
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Erro ao excluir prazo";
            alert(errorMessage);
        }
    }

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
    }, [mostrarEdit, prazoSelecionado]);

    useEffect(() => {
        const carregarProcessos = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/advogados/${oab}/Processos`);
                setProcessos(response.data);
            } catch (error) {
                console.error("Erro ao buscar processos:", error.response?.data || error.message);
            }
        };
        carregarProcessos();
    }, [oab, API_BASE_URL]);

    useEffect(() => {
        const carregarPrazos = async () => {
            try {
                const response = num_processo 
                    ? await axios.get(`${API_BASE_URL}/advogados/${oab}/Prazo/${num_processo}`)
                    : await axios.get(`${API_BASE_URL}/advogados/${oab}/Prazo`);
                setPrazos(response.data);
            } catch (error) {
                console.error("Erro ao buscar prazos:", error);
            }
        };
        carregarPrazos();
    }, [oab, num_processo, API_BASE_URL]);

    const prazosFiltrados = prazos.filter(prazo => {
        const buscaLower = busca.toLowerCase();
        return (
            prazo.nome_prapro.toLowerCase().includes(buscaLower) ||
            prazo.descritao_prapro.toLowerCase().includes(buscaLower) ||
            prazo.status_prapro.toLowerCase().includes(buscaLower) ||
            prazo.num_processo.toString().includes(busca) ||
            prazo.data_prapro.toString().includes(busca)
        );
    });

    return (
        <div className="container">
            <header className="central">
                <Link to="/"><img src={logo} alt="logo" /></Link>
                <Link to="/"><h1>ADVOCACIA ALMEIDA</h1></Link>

                <nav>
                    <button className="agenda" onClick={() => navigate(`/advogados/${oab}/Agenda`, {replace: true})}>AGENDA</button>
                    <button className="contratos" onClick={() => navigate(`/advogados/${oab}/Contratos`, {replace: true})}>CONTRATOS</button>
                    <button className="processos" onClick={() => navigate(`/advogados/${oab}/Processos`, {replace: true})}>PROCESSOS</button>
                    <button className="pagamentos" onClick={() => navigate(`/advogados/${oab}/Pagamentos`, {replace: true})}>PAGAMENTOS</button>
                    <button className="clientes" onClick={() => navigate(`/advogados/${oab}/Clientes`, {replace: true})}>CLIENTES</button>
                </nav>
            </header>

            <main className="main-agenda">
                <div className="buscar-add">
                    <input
                        name="input-busca"
                        type="text"
                        placeholder="Buscar"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                    <button onClick={() => navigate(`/advogados/${oab}/Agenda`)}>AGENDA</button>
                    <button onClick={() => {setMostrarProcesso(true)}}>ADICIONAR</button>
                </div>

                {error && <div className="error-message">{error}</div>}
                {loading && <div className="loading">Carregando...</div>}

                <ul className="ul-comp">
                    {prazosFiltrados.map((prazo) => (
                        <li className="li-comp" key={prazo.cod_prapro}>
                            <button onClick={() => {
                                setMostrarInfo(true);
                                setPrazoSelecionado(prazo)}}>
                                <p className="data">{new Date(prazo.data_prapro).toLocaleDateString()}</p>
                                <p>{prazo.nome_prapro}</p><hr/>
                                <p>{prazo.status_prapro}</p>
                            </button>
                        </li>
                    ))}
                </ul>
                
                {mostrarInfo && prazoSelecionado && (
                    <div className="aba-comp">
                        <h3>PRAZO DO PROCESSO</h3>

                        <div className="info">
                            <div className="inputers">
                                <div className="basicoc">
                                    <input
                                        value={prazoSelecionado.nome_prapro}
                                        readOnly
                                    />
                                    <input
                                        value={prazoSelecionado.num_processo}
                                        readOnly
                                    />
                                    <input
                                        value={new Date(prazoSelecionado.data_prapro).toLocaleDateString()}
                                        readOnly
                                    />
                                </div>
                                <div className="dadosc">
                                    <input
                                        value={prazoSelecionado.status_prapro}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <textarea
                                value={prazoSelecionado.descritao_prapro}
                                readOnly
                            />
                        </div>

                        <div className="botoes">
                            <button className="editar" onClick={() => {setMostrarEdit(true); setMostrarInfo(false)}}>EDITAR</button>
                            <button className="voltar" onClick={() => setMostrarInfo(false)}>VOLTAR</button>
                            <button className="excluir" onClick={() => deletarPrazo(prazoSelecionado.cod_prapro)}>EXCLUIR</button>
                        </div>
                    </div>
                )}

                {mostrarEdit && prazoSelecionado && (
                    <div className="aba-edit-comp">
                        <h3>EDITAR PRAZO</h3>

                        <form onSubmit={editarPrazo}>
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
                                        <option value="pendente">Pendente</option>
                                        <option value="concluido">Concluído</option>
                                        <option value="cancelado">Cancelado</option>
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
                                <button className="voltar" onClick={() => {setMostrarEdit(false)}}>VOLTAR</button>
                                {error && <div className="error-message">{error}</div>}
                                <button className="salvar" type="submit" disabled={loading}>
                                    {loading ? "SALVANDO..." : "SALVAR"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {mostrarProcesso && (
                    <div className="aba-contrato-compromisso">
                        <h3>SELECIONE O PROCESSO</h3>
                        <table className="contratos-compromisso">
                            <thead>
                                <tr>
                                    <th>Número</th>
                                    <th>Cliente</th>
                                    <th>Status</th>
                                    <th>Tipo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processos.map((processo) => (
                                    <tr key={processo.num_processo} onClick={() => {selecionarProcesso(processo)}}>
                                        <td>{processo.num_processo}</td>
                                        <td>{processo.nome_cliente}</td>
                                        <td>{processo.status_processo}</td>
                                        <td>{processo.tipo_processo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="botoes">
                            <button className="voltar" onClick={() => setMostrarProcesso(false)}>VOLTAR</button>
                        </div>
                    </div>
                )}

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
                                        <option value="pendente">Pendente</option>
                                        <option value="concluido">Concluído</option>
                                        <option value="cancelado">Cancelado</option>
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
                                <button className="voltar" onClick={() => {setMostrarAdd(false); setMostrarProcesso(true)}}>VOLTAR</button>
                                {error && <div className="error-message">{error}</div>}
                                <button className="salvar" type="submit" disabled={loading}>
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