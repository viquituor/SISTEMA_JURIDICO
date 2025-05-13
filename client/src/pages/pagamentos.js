import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../public/logo.png";
import "../style/pagamentos.css";
import "../style/global.css";
import { Link, useParams, useNavigate } from 'react-router-dom';

const Pagamentos = () => {
    const { oab } = useParams();
    const navigate = useNavigate();
    const [busca, setBusca] = useState("");
    const [contratos, setContratos] = useState([]);
    const [mostrarInfo, setMostrarInfo] = useState(false);
    const [mostrarInfoPag, setMostrarInfoPag] = useState(false);
    const [pagamentoSelecionado, setPagamentoSelecionado] = useState(null);
    const [contratoSelecionado, setContratoSelecionado] = useState(null);
    const [listaPagamentos, setListaPagamentos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Carrega pagamentos quando um contrato é selecionado
    useEffect(() => {
        const listarPagamentos = async () => {
            if (!contratoSelecionado?.cod_contrato) return;
            
            try {
                setLoading(true);
                const response = await axios.get(
                    `http://localhost:3001/advogados/${oab}/Pagamentos/${contratoSelecionado.cod_contrato}`
                );
                setListaPagamentos(response.data);
                setError(null);
            } catch (error) {
                console.error("Erro ao buscar pagamentos:", error);
                setError("Erro ao carregar pagamentos");
            } finally {
                setLoading(false);
            }
        };

        listarPagamentos();
    }, [contratoSelecionado, oab]); // Adicionado dependências

    // Carrega lista de contratos inicial
    useEffect(() => {
        const carregarContratos = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `http://localhost:3001/advogados/${oab}/Pagamentos`
                );
                setContratos(response.data);
                setError(null);
            } catch (error) {
                console.error("Erro ao buscar contratos:", error);
                setError("Erro ao carregar contratos");
            } finally {
                setLoading(false);
            }
        };

        carregarContratos();
    }, [oab]);

    const contratosFiltrados = contratos.filter(contrato =>
        contrato.nome_cliente.toLowerCase().includes(busca.toLowerCase()) ||
        contrato.status_contrato.toLowerCase().includes(busca.toLowerCase()) ||
        contrato.tipo_servico.toLowerCase().includes(busca.toLowerCase()) ||
        contrato.data_inicio.toLowerCase().includes(busca.toLowerCase()) ||
        contrato.valor.toString().includes(busca.toLowerCase()) ||
        contrato.CPF.toString().includes(busca.toLowerCase())
    );

    return (
        <div className="container">
            <header className="central">
                <Link to="/"><img src={logo} alt="logo" /></Link>
                <Link to="/"><h1>ADVOCACIA ALMEIDA</h1></Link>

                <nav>
                    <button className="agendaAtv" onClick={() => navigate(`/advogados/${oab}/Agenda`, { replace: true })}>AGENDA</button>
                    <button className="contratos" onClick={() => navigate(`/advogados/${oab}/Contratos`, { replace: true })}>CONTRATOS</button>
                    <button className="processos">PROCESSOS</button>
                    <button className="pagamentos">PAGAMENTOS</button>
                    <button className="clientes" onClick={() => navigate(`/advogados/${oab}/Clientes`, { replace: true })}>CLIENTES</button>
                </nav>
            </header>

            <main className="main-pag">
                <div className="buscar-add">
                    <input
                        name="input-busca"
                        type="text"
                        placeholder="Buscar"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                    <button>ADICIONAR</button>
                </div>

                {error && <div className="error-message">{error}</div>}
                {loading && <div className="loading">Carregando...</div>}

                <table className="table-pagamentos">
                    <thead>
                        <tr>
                            <th>codigo</th>
                            <th>nome</th>
                            <th>status contrato</th>
                            <th>tipo</th>
                            <th>status pagamento</th>
                            <th className="falta">faltante</th>
                            <th className="pago">valor pago</th>
                            <th>valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contratosFiltrados.map((contrato) => (
                            <tr 
                                key={contrato.cod_contrato} 
                                onClick={() => {
                                    setMostrarInfo(true);
                                    setContratoSelecionado(contrato);
                                }}
                            >
                                <td>{contrato.cod_contrato}</td>
                                <td>{contrato.nome_cliente}</td>
                                <td>{contrato.status_contrato}</td>
                                <td>{contrato.tipo_servico}</td>
                                <td>{contrato.status_pag}</td>
                                <td className="falta-lista">{contrato.faltante}</td>
                                <td className="pago-lista">{contrato.valor_pago}</td>
                                <td>{contrato.valor}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {mostrarInfo && contratoSelecionado && (
                    <div className="info-pag">
                        <h3> PAGAMENTOS DO CONTRATO</h3>
                        <div className="basico">
                            <label> codigo do contrato<br/>
                            <input
                                type="text"
                                value={contratoSelecionado.cod_contrato}
                                readOnly
                            />
                            </label>
                            <label> cliente <br/>
                            <input
                                type="text"
                                value={contratoSelecionado.nome_cliente}
                                readOnly
                            />
                            </label>
                            <label>tipo de serviço<br/>
                            <input
                                type="text"
                                value={contratoSelecionado.tipo_servico}
                                readOnly
                            />
                            </label>
                            <label> status do contrato <br/>
                            <input
                                type="text"
                                value={contratoSelecionado.status_contrato}
                                readOnly
                            />
                            </label>
                            <label> valor <br/>
                            <input
                                type="text"
                                value={contratoSelecionado.valor}
                                readOnly
                            />
                            </label>
                        </div>
                        {loading ? (
                            <div>Carregando pagamentos...</div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>codigo</th>
                                        <th>data de pagamento</th>
                                        <th>data vencimento</th>
                                        <th>status de pagamento</th>
                                        <th>metodo</th>
                                        <th>valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listaPagamentos.length > 0 ? (
                                        listaPagamentos.map((pagamento) => (
                                            <tr key={pagamento.cod_pag} onClick={() => {setMostrarInfo(false); setMostrarInfoPag(true); setPagamentoSelecionado(pagamento)}}>
                                                <td>{pagamento.cod_pag}</td>
                                                <td>{new Date (pagamento.data_pag).toLocaleDateString()}</td>
                                                <td>{new Date (pagamento.data_vencimento).toLocaleDateString()}</td>
                                                <td>{pagamento.status_pag}</td>
                                                <td>{pagamento.metodo}</td>
                                                <td>{pagamento.valorPago}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6">Nenhum pagamento encontrado</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                        <div className="botoes">
                        <button>ADICIONAR</button>
                        <button className="voltar" onClick={()=> setMostrarInfo(false)}>VOLTAR</button>
                        </div>
                    </div>

                )}
                {mostrarInfoPag && pagamentoSelecionado && (
                    <div className="info-pagamento">
                        <h3> INFORMAÇÕES DO PAGAMENTO </h3>
                        <div className="basico">
                            <label>codigo de pagamento <br/>
                            <input
                                type="text"
                                value={pagamentoSelecionado.cod_pag}
                                readOnly
                            />
                            </label>
                            <label > data do pagamento<br/>
                            <input
                                type="text"
                                value={new Date (pagamentoSelecionado.data_pag).toLocaleDateString()}
                                readOnly
                            />
                            </label>
                            <label> data de vencimento<br/>
                            <input
                                type="text"
                                value={new Date (pagamentoSelecionado.data_vencimento).toLocaleDateString()}
                                readOnly
                            /> 
                            </label>
                            <label> status do pagamento<br/>
                            <input
                                type="text"
                                value={pagamentoSelecionado.status_pag}
                                readOnly
                            />
                            </label>
                            <label> metodo de pagamento<br/>
                            <input
                                type="text"
                                value={pagamentoSelecionado.metodo}
                                readOnly
                            />
                            </label>
                            <label> valor pago <br/>
                            <input
                                type="text"
                                value={pagamentoSelecionado.valorPago}
                                readOnly
                            />
                            </label>
                        </div>
                        <textarea
                        value={pagamentoSelecionado.descricao}
                        readOnly
                        />
                        <div className="botoes">
                            <button className="editar">EDITAR</button>
                            <button className="voltar" onClick={()=> {setMostrarInfoPag(false);setMostrarInfo(true)}}>VOLTAR</button>
                            <button className="excluir">EXCLUIR</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Pagamentos;