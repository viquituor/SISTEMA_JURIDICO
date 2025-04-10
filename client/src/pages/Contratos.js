import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../public/logo.png";
import "../style/contratos.css";
import "../style/global.css";
import { Link, useParams, useNavigate } from 'react-router-dom';

const Contratos = () => {
    const { oab } = useParams();
    const navigate = useNavigate();
    const [busca, setBusca] = useState("");
    const [contratos, setContratos] = useState([]);
    const [agendas, setAgendas] = useState([]);
    const [cod_contratoSelecionado, setCod_contratoSelecionado] = useState(null);
    const [contratoSelecionado, setContratoSelecionado] = useState(null);
    const [mostrarInfo, setMostrarInfo] = useState(false);
    
    // Carrega agendas quando um contrato é selecionado
    useEffect(() => {
        const carregarAgendas = async () => {
            try {
                if (cod_contratoSelecionado) {
                    const response = await axios.get(`http://localhost:3001/advogados/${oab}/Contratos/${cod_contratoSelecionado}`);
                    setAgendas(response.data);
                }
            } catch (error) {
                console.error("Erro ao buscar agenda:", error.response?.data || error.message);
            }
        };
        carregarAgendas();
    }, [cod_contratoSelecionado, oab]);

    // Carrega contratos quando o componente monta ou OAB muda
    useEffect(() => {
        const carregarContratos = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/advogados/${oab}/Contratos`);
                setContratos(response.data);
            } catch (error) {
                console.error("Erro ao buscar contratos:", error.response?.data || error.message);
            }
        };
        carregarContratos();
    }, [oab]);
    
    const contratosFiltrados = contratos.filter(contrato =>
        contrato.nome_cliente.toLowerCase().includes(busca.toLowerCase())
    );

    const agendasFiltrados = agendas.filter(agenda => {
        // Converte o código do contrato para string e o valor de busca para minúsculas
        const codContratoStr = String(agenda.cod_contrato);
        const buscaLower = busca.toLowerCase();
        
        // Verifica se o código do contrato inclui o termo de busca
        return codContratoStr.toLowerCase().includes(buscaLower);
      });

    return(
        <div className="container">
            <header className="central">
                <Link to="/"><img src={logo} alt="logo" /></Link>
                <Link to="/"><h1>ADVOCACIA ALMEIDA</h1></Link>

                <nav>
                    <button className="agenda" onClick={() => navigate(`/advogados/${oab}/Agenda`, {replace: true})}>AGENDA</button>
                    <button className="contratosAtv" onClick={() => navigate(`/advogados/${oab}/Contratos`, {replace: true})}>CONTRATOS</button>
                    <button className="processos">PROCESSOS</button>
                    <button className="pagamentos">PAGAMENTOS</button>
                    <button className="clientes" onClick={() => navigate (`/advogados/${oab}/Clientes`, {replace: true})}>CLIENTES</button>
                </nav>
            </header>

            <main className="main-contrato">
            <div className="buscar-add">
                    <input
                        type="text"
                        placeholder="Buscar"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="input-busca"
                    />
                    <button>ADICIONAR</button>
                </div>
                <div className="tabela-contrato">
                    <table>
                      <thead><tr><th>nome</th><th>status</th><th>tipo</th><th>data de inicio</th><th>valor</th></tr></thead>
                        <tbody>
                        {contratosFiltrados.map((contrato) => (
                            <tr key={contrato.cod_contrato} onClick={() => {setMostrarInfo(true) ;setContratoSelecionado(contrato); setCod_contratoSelecionado(contrato.cod_contrato)}}>
                                <td>{contrato.nome_cliente}</td>
                                <td>{contrato.status_contrato}</td>
                                <td>{contrato.tipo_servico}</td>
                                <td>{new Date (contrato.data_inicio).toLocaleDateString()}</td>
                                <td>{contrato.valor}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {mostrarInfo && contratoSelecionado && cod_contratoSelecionado && (
                        <div className="aba">
                            <h3>INFORMAÇÕES DO CONTRATO</h3>
                            <div className="info-contrato">
                                <div className="basico">
                                    <input
                                        name="nome_cliente"
                                        defaultValue={contratoSelecionado.nome_cliente}
                                        readOnly
                                    />
                                    <input
                                        name="CPF"
                                        defaultValue={contratoSelecionado.CPF}
                                        readOnly
                                    />
                                    <input
                                        name="OAB"
                                        defaultValue={contratoSelecionado.OAB}
                                        readOnly
                                    />
                                    <input
                                        name="nome_advogado"
                                        defaultValue={contratoSelecionado.nome_advogado}
                                        readOnly
                                    />
                                    <input
                                        className="descricao"
                                        name="descricao"
                                        defaultValue={contratoSelecionado.descricao}
                                        readOnly
                                    />
                                </div>
                                <div className="dados">
                                    <input
                                        name="tipo_servico"
                                        defaultValue={contratoSelecionado.tipo_servico}
                                        readOnly
                                    />
                                    <input
                                        name="status_contrato"
                                        defaultValue={contratoSelecionado.status_contrato}
                                        readOnly
                                    />
                                    <input
                                        name="valor"
                                        defaultValue={contratoSelecionado.valor}
                                        readOnly
                                    />
                                    <input
                                        name="data_inicio"
                                        defaultValue={new Date (contratoSelecionado.data_inicio).toLocaleDateString()}
                                        readOnly
                                    />
                                </div>
                                <div className="listas">
                                    <input
                                        name="documentos"
                                        defaultValue={contratoSelecionado.documentos}
                                        readOnly
                                    />
                                    <input
                                        name="pagamentos"
                                        defaultValue={contratoSelecionado.documentos}
                                        readOnly
                                    />
                                    <div className="lista-agenda">
                                    <h4>compromissos</h4>
                                    <ul>
                                        {agendasFiltrados.length > 0 ? (
                                            agendasFiltrados.map((agenda) => (
                                                <li key={agenda.cod_compromisso}>
                                                    {agenda.nome_compromisso} - {new Date(agenda.data_compromisso).toLocaleDateString()} - {agenda.status_compromisso}
                                                </li>
                                            ))
                                        ) : (
                                            <li>Nenhum compromisso encontrado</li>
                                        )}
                                    </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="botoes">
                                <button className="editar">EDITAR</button>
                                <button className="voltar" onClick={() => setMostrarInfo(false)}>VOLTAR</button>
                                <button className="excluir">EXCLUIR</button>
                            </div>
                        </div>
                    )}
                </div>



                
            </main>
        </div>
    );
};

export default Contratos;