import React, { useEffect, useState,  } from "react";
import axios from "axios";
import logo from "../public/logo.png";
import "../style/agenda.css";
import "../style/global.css";
import { Link, useParams, useNavigate } from 'react-router-dom';

const Agenda = () => {
    const { oab } = useParams();
    const navigate = useNavigate();
    const [busca, setBusca] = useState("");
    const [compromissos, setCompromissos] = useState([]);
    const [mostrarInfo, setMostrarInfo] = useState(false);
    const [compromissoSelecionado, setCompromissoSelecionado] = useState(null);
    const [mostrarEdit, setMostrarEdit] = useState(false);
    

    useEffect(() => {
        const CarregarCompromissos = async () => {
                try {
                    const response = await axios.get(`http://localhost:3001/advogados/${oab}/Agenda`);
                    setCompromissos(response.data);
                    console.log(response.data);
                } catch (error) {
                    console.error("Erro ao buscar compromissos:", error);
                    
                }
        }
        CarregarCompromissos();
    },[oab]);
    

    return(
        <div className="container">
            <header className="central">
                <Link to="/"><img src={logo} alt="logo" /></Link>
                <Link to="/"><h1>ADVOCACIA ALMEIDA</h1></Link>

                <nav>
                    <button className="agendaAtv" onClick={() => navigate(`/advogados/${oab}/Agenda`, {replace: true})}>AGENDA</button>
                    <button className="contratos" onClick={() => navigate(`/advogados/${oab}/Contratos`, {replace: true})}>CONTRATOS</button>
                    <button className="processos">PROCESSOS</button>
                    <button className="pagamentos">PAGAMENTOS</button>
                    <button className="clientes" onClick={() => navigate (`/advogados/${oab}/Clientes`, {replace: true})}>CLIENTES</button>
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
                    <button>ADICIONAR</button>
                </div>

                    <ul>
                            {compromissos.map((compromisso) => (
                                <li key={compromisso.cod_compromisso}>
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
                                <input
                                value={compromissoSelecionado.nome_compromisso}
                                readOnly
                                />
                                <input
                                value={compromissoSelecionado.nome_cliente}
                                readOnly
                                />
                                <input
                                value={compromissoSelecionado.CPF}
                                readOnly
                                />
                            </div>
                            <div className="dadosc">
                            <input
                                value={new Date (compromissoSelecionado.data_compromisso).toLocaleDateString()}
                                readOnly
                                />
                                <input
                                value={compromissoSelecionado.status_compromisso}
                                readOnly
                                />
                                <input
                                value={compromissoSelecionado.status_contrato}
                                readOnly
                                />
                            </div>
                            </div>

                            <textarea
                            value={compromissoSelecionado.descricao}
                            readOnly
                            />

                        </div>

                        <div className="botoes">
                                <button className="editar" onClick={() => {setMostrarEdit(true); setMostrarInfo(false)}}>EDITAR</button>
                                <button className="voltar" onClick={() => setMostrarInfo(false)}>VOLTAR</button>
                                <button className="excluir" >EXCLUIR</button>
                            </div>

                    </div>
                )}
                {mostrarEdit && compromissoSelecionado && (
                    <div className="aba-edit"></div>
                )}

            </main>
        </div>
    );
};

export default Agenda;