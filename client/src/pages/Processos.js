import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../public/logo.png";
import "../style/processos.css";
import "../style/global.css";
import { Link, useParams, useNavigate } from 'react-router-dom';


const Processos = () => {

    const { oab } = useParams();
    const navigate = useNavigate();
    const [busca, setBusca] = useState("");
    const [processos, setProcessos] = useState([]);
    const [contratos, setContratos] = useState([]);
    const [contratoSelecionado, setContratoSelecionado] = useState([]);
    const [processoSelecionado, setProcessoSelecionado] = useState([]);
    const [mostrarContratos, setMostrarContratos] = useState(false);
    const [mostrarAdd, setMostrarAdd] = useState (false);
    const [mostrarInfo, setMostrarInfo] = useState (false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState ({
        cod_contrato : contratoSelecionado.cod_contrato ,
        num_processo : '',
        status_processo: '',
        descricao : ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const criarProcesso = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await axios.post(`http://localhost:3001/advogados/${oab}/Processos/${contratoSelecionado.cod_contrato}`, {...formData, cod_contrato: contratoSelecionado.cod_contrato});
        
            alert("Processo cadastrado com sucesso!");
            setMostrarAdd(false);
            
            // Recarrega a lista
            const response = await axios.get(`http://localhost:3001/advogados/${oab}/Processos`)
            setProcessos(response.data);
            
            // Reseta o formulário
            setFormData({
                cod_contrato : contratoSelecionado.cod_contrato ,
                num_processo : '',
                status_processo: '',
                descricao : ''
            });
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };


    useEffect (()=> {
        const carregarProcessos = async () => {
    try {
            const response = await axios.get(`http://localhost:3001/advogados/${oab}/Processos`)
            setProcessos(response.data);
    } catch (error) {
            alert('erro ao buscar processos', error);
            throw error;
    }}
        carregarProcessos();
    },[oab]);

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

const processosFiltrados = processos.filter(processo =>
        processo.nome.toLowerCase().includes(busca.toLowerCase()) ||
        processo.status_contrato.toLowerCase().includes(busca.toLowerCase()) ||
        processo.tipo_servico.toLowerCase().includes(busca.toLowerCase()) ||
        processo.num_processo.toString().includes(busca.toLowerCase())||
        processo.CPF.toString().includes(busca.toLowerCase())
        );











return (

    <div className="container">
            <header className="central">
                <Link to="/"><img src={logo} alt="logo" /></Link>
                <Link to="/"><h1>ADVOCACIA ALMEIDA</h1></Link>

                <nav>
                    <button className="agenda" onClick={() => navigate(`/advogados/${oab}/Agenda`, {replace: true})}>AGENDA</button>
                    <button className="contratos" onClick={() => navigate(`/advogados/${oab}/Contratos`, {replace: true})}>CONTRATOS</button>
                    <button className="processosAtv" onClick={() => navigate(`/advogados/${oab}/Processos`, {replace: true})}>PROCESSOS</button>
                    <button className="pagamentos" onClick={() => navigate(`/advogados/${oab}/Pagamentos`, {replace: true})}>PAGAMENTOS</button>
                    <button className="clientes" onClick={() => navigate (`/advogados/${oab}/Clientes`, {replace: true})}>CLIENTES</button>
                </nav>
            </header>

            <main className="main-pross">
            <div className="buscar-add">
                    <input
                        name="input-busca"
                        type="text"
                        placeholder="Buscar"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        
                    />
                    <button>PRAZOS DE PROCESSOS</button>
                    <button onClick={()=>{setMostrarContratos(true)}}>ADICIONAR</button>
                </div>

                    <table className="table-pross">
                    <thead>
                        <tr>
                            <th>cod de contrato</th><th>nome</th><th>CPF</th><th>tipo de serviço</th><th>numero do processo</th><th>status do processo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processosFiltrados.map((processo)=>(                       
                             <tr key={processo.num_processo} onClick={()=>{setMostrarInfo(true);setProcessoSelecionado(processo)}}>
                            <td>{processo.cod_contrato}</td><td>{processo.nome}</td><td>{processo.CPF}</td><td>{processo.tipo_servico}</td><td>{processo.num_processo}</td><td>{processo.status_processo}</td>
                            </tr>
                        ))}
                    </tbody>

                    </table>

                    {mostrarContratos && (
                    <div className="aba-contrato-compromisso">
                        <h3>SELECIONE O CONTRATO</h3>
                        <table className="contratos-compromisso">
                      <thead><tr><th>cod</th><th>nome</th><th>status</th><th>tipo</th><th>data de inicio</th><th>valor</th></tr></thead>
                        <tbody>
                        {contratos.map((contrato) => (
                            <tr key={contrato.cod_contrato} onClick={() => {setMostrarContratos(false);setContratoSelecionado(contrato); setMostrarAdd(true)}}>
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
                    <button className="voltar" onClick={() => setMostrarContratos(false)}>VOLTAR</button>
                    </div>
                    </div>
                    )}
                    {mostrarAdd && contratoSelecionado && (
                        <div className="aba-add-pross">
                                        <h3>ADICIONE AS INFORMAÇÕES</h3>
                                        <form onSubmit={criarProcesso}>
                                            <div className="basico">
                                            <label>codigo do contrato<br/>
                                            <input
                                            nome='cod_contrato'
                                            type="text"
                                            value={contratoSelecionado.cod_contrato}
                                            readOnly
                                            /></label>
                                            <label>numero do processo<br/>
                                            <input
                                            name="num_processo"
                                            type="text"
                                            value={formData.num_processo}
                                            onChange={handleChange}
                                            /></label>
                                            <label>status do processo<br/>
                                            <select name="status_processo" onChange={handleChange} value={formData.status_processo} >
                                                <option value="" ></option>
                                                <option value="em andamento">EM ANDAMENTO</option>
                                                <option value="cancelado" >CANCELADO</option>
                                                <option value="concluido" >CONCLUIDO</option>
                                            </select>
                                            </label>
                                            </div>
                                            <label>DESCRIÇÃO<br/>
                                            <textarea 
                                            type="text"
                                            name="descricao"
                                            onChange={handleChange}
                                            value={formData.descricao}
                                            />
                                            </label>
                            <div className="botoes">
                                    <button className="voltar" onClick={() => {setMostrarAdd(false); setMostrarContratos(true)}}>VOLTAR</button>
                                 {error && <div className="error-message">{error}</div>}
                                    <button className="salvar" type="submit" disabled={loading} >{loading ? "SALVANDO..." : "SALVAR"}</button>
                            </div>
                                        </form>
                        </div>
    
                    )}
                    {mostrarInfo && processoSelecionado && (
                        <div className="aba-info-pross">
                            <h3>INFORMAÇÕES DO PROCESSO</h3>
                                        <form>
                                            <div className="basico">
                                            <label>codigo do contrato<br/>
                                            <input
                                            readOnly
                                            value={processoSelecionado.cod_contrato}
                                            /></label>
                                            <label>numero do processo<br/>
                                            <input
                                            readOnly
                                            value={processoSelecionado.num_processo}
                                            /></label>
                                            <label>status do processo<br/>
                                            <input
                                            readOnly
                                            value={processoSelecionado.status_processo}
                                            /></label>
                                            </div>
                                            <label>DESCRIÇÃO<br/>
                                            <textarea 
                                            readOnly
                                            value={processoSelecionado.descricao}
                                            />
                                            </label>
                            <div className="botoes">
                                <button className="editar"  >EDITAR</button>
                                <button className="voltar" onClick={()=> setMostrarInfo(false)}>VOLTAR</button>
                                <button className="excluir" >EXCLUIR</button>
                            </div>
                                        </form>
                        </div>
                    )}

            </main>
        </div>

    );
};

export default Processos;





