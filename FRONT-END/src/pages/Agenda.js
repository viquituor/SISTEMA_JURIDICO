import React, { useEffect, useState,  } from "react";
import axios from "axios";
import logo from "../public/logo.png";
import "../style/agenda.css";
import "../style/global.css";
import { Link, useParams, useNavigate } from 'react-router-dom';

const Agenda = () => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    const { oab } = useParams();
    const navigate = useNavigate();
    const [busca, setBusca] = useState("");
    const [compromissos, setCompromissos] = useState([]);
    const [contratos, setContratos] = useState([]);
    const [contratoSelecionado, setContratoSelecionado] = useState(null);
    const [mostrarInfo, setMostrarInfo] = useState(false);
    const [mostrarEdit, setMostrarEdit] = useState(false);
    const [mostrarAdd, setMostrarAdd] = useState(false);
    const [mostrarContrato, setMostrarContrato] = useState(false);
    const [compromissoSelecionado, setCompromissoSelecionado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState ({
        cod_contrato:'',
        nome_compromisso:'',
        data_compromisso:'',
        descricao:'',
        status_compromisso:''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const selecionarContrato = (contrato) => {
        setContratoSelecionado(contrato);
        setFormData(prev => ({
            ...prev,
            cod_contrato: contrato.cod_contrato
        }));
        setMostrarAdd(true);
        setMostrarContrato(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Validação adicional no frontend
            if (!formData.cod_contrato || !formData.data_compromisso || !formData.nome_compromisso) {
                throw new Error("Preencha todos os campos obrigatórios");
            }
    
            await axios.post(`${API_BASE_URL}/advogados/${oab}/agenda`, formData);
        
            alert("Compromisso cadastrado com sucesso!");
            setMostrarAdd(false);
            
            // Recarrega a lista
            const res = await axios.get(`${API_BASE_URL}/advogados/${oab}/agenda`);
            setCompromissos(res.data);
            
            // Reseta o formulário
            setFormData({
                cod_contrato: '',
                nome_compromisso: '',
                data_compromisso: '',
                descricao: '',
                status_compromisso: ''
            });
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    const editarCompromisso = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
        // Formata os dados antes de enviar
        const dadosParaEnviar = {
            ...formData,
            data_compromisso: new Date(formData.data_compromisso).toISOString()
        };

        const response = await axios.put(
            `${API_BASE_URL}/advogados/${oab}/Agenda/${compromissoSelecionado.cod_compromisso}`,
            dadosParaEnviar,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.success) {
            alert("Compromisso editado com sucesso!");
            // Atualiza a lista local sem precisar recarregar do servidor
            setCompromissos(prev => prev.map(item => 
                item.cod_compromisso === compromissoSelecionado.cod_compromisso 
                    ? { ...item, ...formData } 
                    : item
            ));
            setMostrarEdit(false);
        }
    } catch (err) {
        console.error("Erro detalhado:", err.response?.data);
        setError(err.response?.data?.error || "Erro ao editar compromisso");
    } finally {
        setLoading(false);
    }
    };

    const deletarCompromisso = async (cod_compromisso) => {

        try {
            const confirmar = window.confirm("Tem certeza que deseja excluir este compromisso?");
            if (!confirmar) return;

            const response = await axios.delete(`${API_BASE_URL}/advogados/${oab}/Agenda/${cod_compromisso}`);

            if (response.status === 200) {
                alert("Compromisso excluído com sucesso!");
                setMostrarInfo(false);
                setCompromissos(prev => prev.filter(comp => comp.cod_compromisso !== cod_compromisso));
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Erro ao excluir compromisso";
            alert(errorMessage);
        }
    }

    useEffect(() => {
    if (mostrarEdit && compromissoSelecionado) {
        // Formata a data para o input type="date" (YYYY-MM-DD)
        const dataFormatada = compromissoSelecionado.data_compromisso 
            ? new Date(compromissoSelecionado.data_compromisso).toISOString().split('T')[0]
            : '';
            
        setFormData({
            cod_contrato: compromissoSelecionado.cod_contrato || '',
            nome_compromisso: compromissoSelecionado.nome_compromisso || '',
            data_compromisso: dataFormatada,
            descricao: compromissoSelecionado.descricao || '',
            status_compromisso: compromissoSelecionado.status_compromisso || 'marcado'
        });
    }
    }, [mostrarEdit, compromissoSelecionado]);

    useEffect(() => {
            const carregarContratos = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/advogados/${oab}/Contratos`);
                    setContratos(response.data);
                } catch (error) {
                    console.error("Erro ao buscar contratos:", error.response?.data || error.message);
                }
            };
            carregarContratos();
    }, [oab, API_BASE_URL]);

    useEffect(() => {
        const CarregarCompromissos = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/advogados/${oab}/Agenda`);
                    setCompromissos(response.data);
                    console.log(response.data);
                } catch (error) {
                    console.error("Erro ao buscar compromissos:", error);
                    
                }
        }
        CarregarCompromissos();
    },[oab, API_BASE_URL]);

    const compromissosFiltrados = compromissos.filter(compromisso => {
        const buscaLower = busca.toLowerCase();
        return (
            compromisso.nome_compromisso.toLowerCase().includes(buscaLower) ||
            compromisso.nome_cliente.toLowerCase().includes(buscaLower) ||
            compromisso.status_compromisso.toString().toLowerCase().includes(buscaLower) ||
            compromisso.cod_contrato.toString().includes(busca) ||
            compromisso.data_compromisso.toString().includes(busca)
        );
    });



    return(
        <div className="container">
            <header className="central">
                <Link to="/advogados"><img src={logo} alt="logo" /></Link>
                <Link to="/advogados"><h1>ADVOCACIA ALMEIDA</h1></Link>

                <nav>
                    <button className="agendaAtv" onClick={() => navigate(`/advogados/${oab}/Agenda`, {replace: true})}>AGENDA</button>
                    <button className="contratos" onClick={() => navigate(`/advogados/${oab}/Contratos`, {replace: true})}>CONTRATOS</button>
                    <button className="processos" onClick={() => navigate(`/advogados/${oab}/Processos`, {replace: true})}>PROCESSOS</button>
                    <button className="pagamentos" onClick={() => navigate(`/advogados/${oab}/Pagamentos`, {replace: true})}>PAGAMENTOS</button>
                    <button className="clientes" onClick={() => navigate (`/advogados/${oab}/Clientes`, {replace: true})}>CLIENTES</button>
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
                    <button onClick={() => navigate(`/advogados/${oab}/Prazos`)}>PRAZOS DE PROCESSOS</button>
                    <button onClick={() => {setMostrarContrato(true)}}>ADICIONAR</button>
                </div>

                    <ul className="ul-comp">
                            {compromissosFiltrados.map((compromisso) => (
                                <li className="li-comp" key={compromisso.cod_compromisso}>
                                    <button onClick={() => {
                                        setMostrarInfo(true);
                                        setCompromissoSelecionado(compromisso)}}>
                                    <p className="data">{new Date (compromisso.data_compromisso).toLocaleDateString()}</p>
                                    <p>{compromisso.nome_compromisso}</p><hr/>
                                    <p>{compromisso.status_compromisso}</p>
                                    </button>
                                    </li>
                            ))}
                    </ul>
                
                {mostrarInfo && compromissoSelecionado && (
                    <div className="aba-comp">
                        <h3>COMPROMISSO</h3>

                        <div className="info">
                            <div className="inputers">
                            <div className="basicoc">
                                <label> NOME DO COMPROMISSO<br/>
                                <input
                                value={compromissoSelecionado.nome_compromisso}
                                readOnly
                                />
                                </label>
                                <label> NOME DO CLIENTE<br/>
                                <input
                                value={compromissoSelecionado.nome_cliente}
                                readOnly
                                />
                                </label>
                                <label> CPF DO CLIENTE<br/>
                                <input
                                value={compromissoSelecionado.CPF}
                                readOnly
                                />
                                </label>
                            </div>
                            <div className="dadosc">
                                <label> DATA DO COMPROMISSO<br/>
                                <input
                                value={new Date (compromissoSelecionado.data_compromisso).toLocaleDateString()}
                                readOnly
                                />
                                </label>
                                <label> STATUS DO COMPROMISSO<br/>
                                <input
                                value={compromissoSelecionado.status_compromisso}
                                readOnly
                                />
                                </label>
                                <label> STATUS DO CONTRATO<br/>
                                <input
                                value={compromissoSelecionado.status_contrato}
                                readOnly
                                />
                                </label>
                            </div>
                            </div>
                            <label> DESCRIÇÃO DO COMPROMISSO<br/>
                            <textarea
                            value={compromissoSelecionado.descricao}
                            readOnly
                            />
                            </label>

                        </div>

                        <div className="botoes">
                                <button className="editar" onClick={() => {setMostrarEdit(true); setMostrarInfo(false)}}>EDITAR</button>
                                <button className="voltar" onClick={() => setMostrarInfo(false)}>VOLTAR</button>
                                <button className="excluir" onClick={() => deletarCompromisso(compromissoSelecionado.cod_compromisso)}>EXCLUIR</button>
                            </div>

                    </div>
                )}
                {mostrarEdit && compromissoSelecionado && (
                    <div className="aba-edit-comp">

                        <h3>ADICIONAR COMPROMISSO</h3>

                        <form onSubmit={editarCompromisso}>
                            <div className="campos">

                            <label>
                                codigo do contrato
                            <input
                            name="cod_contrato"
                            value={formData.cod_contrato}
                            readOnly
                            />
                            </label>

                            <label>
                                nome do compromisso
                            <input
                            type="text"
                            name="nome_compromisso"
                            onChange={handleChange}
                            value={formData.nome_compromisso||''}
                            required
                            />
                            </label>

                            <label>
                                data
                            <input
                            type="date"
                            name="data_compromisso"
                            onChange={handleChange}
                            value={formData.data_compromisso|| ''}
                            required
                            />
                            </label>

                            <label>
                                status
                            <select name="status_compromisso" onChange={handleChange} value={formData.status_compromisso} required> 
                             <option value="">SELECIONE</option>
                             <option value="comparecido">COMPARECIDO</option>
                             <option value="pendente">pendente</option>
                             <option value="remarcado">REMARCADO</option>
                             <option value="perdido">PERDIDO</option>
                             <option value="cancelado">CANCELADO</option>

                            </select>
                            </label>

                            </div>

                                <textarea
                                    className="descricao"
                                    name="descricao"
                                    onChange={handleChange}
                                    value={formData.descricao}
                                    type="text"
                                    placeholder="Descrição do contrato"
                                    required
                                />

                            <div className="botoes">
                                    <button className="voltar" onClick={() => {setMostrarEdit(false)}}>VOLTAR</button>
                                 {error && <div className="error-message">{error}</div>}
                                    <button className="salvar" type="submit" disabled={loading} >{loading ? "SALVANDO..." : "SALVAR"}</button>
                            </div>

                        </form>

                    </div>
                )}
                {mostrarContrato && (
                    <div className="aba-contrato-compromisso">
                        <h3>SELECIONE O CONTRATO</h3>
                        <table className="contratos-compromisso">
                      <thead><tr><th>cod</th><th>nome</th><th>status</th><th>tipo</th><th>data de inicio</th><th>valor</th></tr></thead>
                        <tbody>
                        {contratos.map((contrato) => (
                            <tr key={contrato.cod_contrato} onClick={() => {selecionarContrato(contrato)}}>
                                <td>{contrato.cod_contrato}</td>
                                <td>{contrato.nome_cliente}</td>
                                <td>{contrato.status_contrato}</td>
                                <td>{contrato.tipo_servico}</td>
                                <td>{new Date (contrato.data_inicio).toLocaleDateString()}</td>
                                <td>{contrato.valor}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className="botoes">
                    <button className="voltar" onClick={() => setMostrarContrato(false)}>VOLTAR</button>
                    </div>
                    </div>
                )}
                {mostrarAdd && contratoSelecionado && (
                    <div className="aba-add-compromisso">
                        <h3>ADICIONAR COMPROMISSO</h3>

                        <form onSubmit={handleSubmit}>
                            <div className="campos">

                            <label>
                                codigo do contrato
                            <input
                            name="cod_contrato"
                            value={formData.cod_contrato}
                            readOnly
                            />
                            </label>

                            <label>
                                nome do compromisso
                            <input
                            type="text"
                            name="nome_compromisso"
                            onChange={handleChange}
                            value={formData.nome_compromisso}
                            required
                            />
                            </label>

                            <label>
                                data
                            <input
                            type="date"
                            name="data_compromisso"
                            onChange={handleChange}
                            value={formData.data_compromisso}
                            required
                            />
                            </label>

                            <label>
                                status
                            <select name="status_compromisso" onChange={handleChange} value={formData.status_compromisso} required> 
                             <option value="">SELECIONE</option>
                             <option value="comparecido">COMPARECIDO</option>
                             <option value="pendente">pendente</option>
                             <option value="remarcado">REMARCADO</option>
                             <option value="perdido">PERDIDO</option>
                             <option value="cancelado">CANCELADO</option>

                            </select>
                            </label>

                            </div>

                                <textarea
                                    className="descricao"
                                    name="descricao"
                                    onChange={handleChange}
                                    value={formData.descricao}
                                    type="text"
                                    placeholder="Descrição do contrato"
                                    required
                                />

                            <div className="botoes">
                                    <button className="voltar" onClick={() => {setMostrarAdd(false); setMostrarContrato(true)}}>VOLTAR</button>
                                 {error && <div className="error-message">{error}</div>}
                                    <button className="salvar" type="submit" disabled={loading} >{loading ? "SALVANDO..." : "SALVAR"}</button>
                            </div>

                        </form>
                    </div>
                )}

            </main>
        </div>
    );
};

export default Agenda;