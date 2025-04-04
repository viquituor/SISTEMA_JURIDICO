import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../public/logo.png";
import "../style/agenda.css";
import "../style/global.css";
import { Link, useParams} from 'react-router-dom';


const Agenda = () => {
    const { oab } = useParams();
    const [busca, setBusca] = useState('');
    const [mostrarInfo, setMostrarInfo] = useState(false);
    const [compromissos, setCompromissos] = useState([]);
    const [contratos, setContratos] = useState([]);
    const [novoCompromisso, setNovoCompromisso] = useState({
        cod_contrato: '',
        data_compromisso: '',
        nome_compromisso: '',
        descricao: '',
        status_compromisso: 'agendado'
    });

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const [responseCompromissos, responseContratos] = await Promise.all([
                    axios.get(`http://localhost:3001/advogados/${oab}/agenda`),
                    axios.get(`http://localhost:3001/advogados/${oab}/agenda/contratos`)
                ]);
                setCompromissos(responseCompromissos.data);
                setContratos(responseContratos.data);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }
        };
        carregarDados();
    }, [oab]);

    const buscarCompromisso = async (cod_compromisso) => {
        try {
            const response = await axios.get(
                `http://localhost:3001/agenda/${oab}/compromissos/${cod_compromisso}`
            );
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar compromisso:", error);
            return null;
        }
    };

    const excluirCompromisso = async (cod_compromisso) => {
        try {
            const confirmacao = window.confirm("Tem certeza que deseja excluir este compromisso?");
            if (!confirmacao) return;

            const response = await axios.delete(
                `http://localhost:3001/agenda/${oab}/compromissos/${cod_compromisso}`
            );

            if (response.data.success) {
                // Atualiza a lista após exclusão
                const { data } = await axios.get(`http://localhost:3001/agenda/${oab}/compromissos`);
                setCompromissos(data);
                alert("Compromisso excluído com sucesso!");
            }
        } catch (error) {
            console.error("Erro ao excluir compromisso:", error);
            alert("Erro ao excluir compromisso");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `http://localhost:3001/advogados/${oab}/agenda`,
                novoCompromisso
            );
            
            if (response.data.success) {
                // Recarrega os compromissos
                const { data } = await axios.get(`http://localhost:3001/advogados/${oab}/agenda`);
                setCompromissos(data);
                setNovoCompromisso({
                    cod_contrato: '',
                    data_compromisso: '',
                    nome_compromisso: '',
                    descricao: '',
                    status_compromisso: 'agendado'
                });
            }
        } catch (error) {
            console.error("Erro ao criar compromisso:", error);
        }
    };


    return(
        <div className="container">
            <header className="central">
                <Link to="/"><img src={logo} alt="logo" /></Link>
                <Link to="/"><h1>ADVOCACIA ALMEIDA</h1></Link>

                <nav>
                    <button className="agenda" to='/'>AGENDA</button>
                    <button className="contratos" to='/'>CONTRATOS</button>
                    <button className="processos" to='/'>PROCESSOS</button>
                    <button className="pagamentos" to='/'>PAGAMENTOS</button>
                    <button className="clientes" to='/'>CLIENTES</button>
                </nav>
            </header>

            <main className="main-agenda">
                <div className="buscar-add">
                <input
                            type="text"
                            placeholder="Buscar compromissos..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            className="input-busca"
                        />
                    <button to="/cadastroadv">ADICIONAR</button>
                </div>
                <div className="cont-agenda">
                    <div className="compromissos">
                        {compromissos.map(compromisso => (
                        <button onClick={() => setMostrarInfo(true)}>
                        <h1>{compromisso.data_compromisso}</h1>
                        <p>{compromisso.nome_compromisso} <br/> {compromisso.descricao}</p>
                        <p>{compromisso.status_compromisso}</p>
                        </button>
                        ))}
                    </div>
                    {mostrarInfo && (
                        <div className="info-compromisso">

                        </div>
                    )}
                </div>
            </main>

            <footer className="footer-principal">
                <p>&copy; 2023 Advocacia Almeida. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default Agenda;