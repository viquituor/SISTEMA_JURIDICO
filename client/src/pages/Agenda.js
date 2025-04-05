import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../public/logo.png";
import "../style/agenda.css";
import "../style/global.css";
import { Link, useParams } from 'react-router-dom';

const Agenda = () => {
    const { oab } = useParams();
    const [busca, setBusca] = useState('');
    const [mostrarInfo, setMostrarInfo] = useState(false);
    const [mostrarAdd, setMostrarAdd] = useState(false);
    const [compromissos, setCompromissos] = useState([]);
    const [ Contratos,setContratos] = useState([]);
    const [compromissoSelecionado, setCompromissoSelecionado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Estado inicial atualizado
const [novoCompromisso, setNovoCompromisso] = useState({
    cod_contrato: '',
    data_compromisso: '',
    nome_compromisso: '',
    descricao: '',
    status_compromisso: 'agendado'
});

// Função para carregar dados
useEffect(() => {
    const carregarDados = async () => {
        try {
            setLoading(true);
            const [responseCompromissos, responseContratos] = await Promise.all([
                axios.get(`http://localhost:3001/advogados/${oab}/Agenda/compromissos`),
                axios.get(`http://localhost:3001/advogados/${oab}/Agenda/contratos`)
            ]);
            
            // Formata datas para o datetime-local
            const compromissosFormatados = responseCompromissos.data.map(c => ({
                ...c,
                data_compromisso: formatarDataParaInput(c.data_compromisso)
            }));
            
            setCompromissos(compromissosFormatados);
            setContratos(responseContratos.data);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            setError("Erro ao carregar agenda");
            setLoading(false);
        }
    };
    carregarDados();
}, [oab]);

// Função auxiliar para formatar data
const formatarDataParaInput = (dataString) => {
    const date = new Date(dataString);
    const isoString = date.toISOString();
    return isoString.substring(0, 16); // Formato YYYY-MM-DDTHH:MM
};

// Manipulador para adicionar novo compromisso
const handleAddSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!novoCompromisso.nome_compromisso || !novoCompromisso.data_compromisso) {
        alert("Preencha pelo menos o nome e a data do compromisso");
        return;
    }

    try {
        const response = await axios.post(
            `http://localhost:3001/advogados/${oab}/Agenda/compromissos`,
            {
                ...novoCompromisso,
                data_compromisso: new Date(novoCompromisso.data_compromisso).toISOString()
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        
        if (response.data.success) {
            // Atualiza a lista de compromissos
            const { data } = await axios.get(`http://localhost:3001/advogados/${oab}/Agenda/compromissos`);
            
            // Formata as datas
            const compromissosFormatados = data.map(c => ({
                ...c,
                data_compromisso: formatarDataParaInput(c.data_compromisso)
            }));
            
            setCompromissos(compromissosFormatados);
            
            // Reseta o formulário
            setNovoCompromisso({
                cod_contrato: '',
                data_compromisso: '',
                nome_compromisso: '',
                descricao: '',
                status_compromisso: 'agendado'
            });
            
            setMostrarAdd(false);
            alert("Compromisso adicionado com sucesso!");
        }
    } catch (error) {
        console.error("Erro ao criar compromisso:", error);
        
        if (error.response) {
            alert(error.response.data.error || error.response.data.message || "Erro na requisição");
        } else {
            alert("Erro ao configurar a requisição");
        }
    }
};

    // Filtra compromissos pela busca
    const compromissosFiltrados = compromissos.filter(compromisso => {
        if (!busca) return true;
        return (
            compromisso.nome_compromisso.toLowerCase().includes(busca.toLowerCase()) ||
            compromisso.descricao.toLowerCase().includes(busca.toLowerCase())
        );
    });

    // Manipulador para selecionar um compromisso
    const selecionarCompromisso = (compromisso) => {
        setCompromissoSelecionado(compromisso);
        setMostrarInfo(true);
    };


    // Manipulador para excluir compromisso
    const handleExcluir = async (cod_compromisso) => {
        try {
            const confirmacao = window.confirm("Tem certeza que deseja excluir este compromisso?");
            if (!confirmacao) return;

            const response = await axios.delete(
                `http://localhost:3001/advogados/${oab}/Agenda/compromissos/${cod_compromisso}`
            );

            if (response.data.success) {
                // Atualiza a lista após exclusão
                const { data } = await axios.get(`http://localhost:3001/advogados/${oab}/Agenda`);
                setCompromissos(data);
                setMostrarInfo(false);
                alert("Compromisso excluído com sucesso!");
            }
        } catch (error) {
            console.error("Erro ao excluir compromisso:", error);
            alert("Erro ao excluir compromisso");
        }
    };

    // Formata a data para exibição
    const formatarData = (dataString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dataString).toLocaleDateString('pt-BR', options);
    };

    return(
        <div className="container">
            <header className="central">
                <Link to="/"><img src={logo} alt="logo" /></Link>
                <Link to="/"><h1>ADVOCACIA ALMEIDA</h1></Link>

                <nav>
                    <button className="agenda">AGENDA</button>
                    <button className="contratos">CONTRATOS</button>
                    <button className="processos">PROCESSOS</button>
                    <button className="pagamentos">PAGAMENTOS</button>
                    <button className="clientes">CLIENTES</button>
                </nav>
            </header>

            <main className="main-agenda">
                <div className="buscar-add">
                    <input
                        type="text"
                        placeholder="Buscar"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="input-busca"
                    />
                    <button onClick={() => setMostrarAdd(true)}>ADICIONAR</button>
                </div>
                
                <div className="cont-agenda">
                    {loading ? (
                        <div className="loading">Carregando...</div>
                    ) : error ? (
                        <div className="error">{error}</div>
                    ) : compromissosFiltrados.length === 0 ? (
                        <div className="sem-compromissos">
                            Nenhum compromisso encontrado
                        </div>
                    ) : (
                        <div className="compromissos">
                            {compromissosFiltrados.map((compromisso, index) => (
                                <div 
                                    key={index}
                                    className="compromisso-item"
                                    onClick={() => selecionarCompromisso(compromisso)}
                                >
                                    <h3>{formatarData(compromisso.data_compromisso)}</h3>
                                    <h4>{compromisso.nome_compromisso}</h4>
                                    <p>{compromisso.descricao}</p>
                                    <span className={`status ${compromisso.status_compromisso}`}>
                                        {compromisso.status_compromisso}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal de informações do compromisso */}
                {mostrarInfo && compromissoSelecionado && (
                    <div className="aba">
                        <h1>Compromisso</h1>
                        <form>
                            <div className="cont-input">
                                <input 
                                    value={compromissoSelecionado.nome_compromisso} 
                                    readOnly 
                                /> 
                                <input 
                                    value={compromissoSelecionado.status_compromisso} 
                                    readOnly 
                                />
                            </div>
                            <div className="cont-input">
                                <input 
                                    value={compromissoSelecionado.cod_contrato} 
                                    readOnly 
                                /> 
                                <input 
                                    value={formatarData(compromissoSelecionado.data_compromisso)} 
                                    readOnly 
                                />
                            </div>
                            <textarea 
                                value={compromissoSelecionado.descricao} 
                                readOnly 
                            />

                            <button type="button" onClick={() => setMostrarInfo(false)}>Voltar</button>
                            <button 
                                type="button" 
                                onClick={() => handleExcluir(compromissoSelecionado.cod_compromisso)}
                            >
                                Excluir
                            </button>
                        </form>
                    </div>
                )}

                {/* Modal para adicionar novo compromisso */}
                {mostrarAdd && (
    <div className="aba">
        <h1>Adicionar Compromisso</h1>
        <form className="formulario-agenda" onSubmit={handleAddSubmit}>
            <div className="cont-input">
                <input 
                    name="nome_compromisso" // Corrigido de "nome_compromisso" para "nome_compromisso"
                    placeholder="Nome do compromisso *"
                    value={novoCompromisso.nome_compromisso}
                    onChange={(e) => setNovoCompromisso({
                      ...novoCompromisso,
                      nome_compromisso: e.target.value
                    })}
                    required
                />
                <select
                    value={novoCompromisso.status_compromisso}
                    onChange={(e) => setNovoCompromisso({
                        ...novoCompromisso,
                        status_compromisso: e.target.value
                    })}
                >
                    <option value="agendado">Agendado</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="cancelado">Cancelado</option>
                    <option value="concluido">Concluído</option>
                </select>
            </div>
            
            <div className="cont-input">
                <input 
                    name="cod_contrato"
                    placeholder="Código do contrato"
                    value={novoCompromisso.cod_contrato}
                    onChange={(e) => setNovoCompromisso({
                        ...novoCompromisso,
                        cod_contrato: e.target.value
                    })}
                />
                <input 
                    type="date"
                    name="data_compromisso"
                    value={novoCompromisso.data_compromisso}
                    onChange={(e) => setNovoCompromisso({
                        ...novoCompromisso,
                        data_compromisso: e.target.value
                    })}
                    required
                />
            </div>
            
            <textarea
                placeholder="Descrição"
                value={novoCompromisso.descricao}
                onChange={(e) => setNovoCompromisso({
                    ...novoCompromisso,
                    descricao: e.target.value
                })}
            />
            
            <div className="botoes-form">
                <button type="submit">Salvar</button>
                <button type="button" onClick={() => setMostrarAdd(false)}>Cancelar</button>
            </div>
        </form>
    </div>
)}
            </main>

            <footer className="footer-principal">
                <p>&copy; 2023 Advocacia Almeida. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default Agenda;