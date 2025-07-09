import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../public/logo.png";
import "../style/pagamentos.css";
import "../style/global.css";
import { Link, useParams, useNavigate } from 'react-router-dom';

const Pagamentos = () => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    const { oab } = useParams();
    const navigate = useNavigate();
    const [busca, setBusca] = useState("");
    const [contratos, setContratos] = useState([]);
    const [contratosAll, setContratosAll] = useState([]);
    const [mostrarInfo, setMostrarInfo] = useState(false);
    const [mostrarInfoPag, setMostrarInfoPag] = useState(false);
    const [mostrarContrato, setMostrarContrato] = useState(false);
    const [mostrarAdd, setMostrarAdd] = useState(false);
    const [mostrarEdit, setMostrarEdit] = useState(false);
    const [pagamentoSelecionado, setPagamentoSelecionado] = useState(null);
    const [contratoSelecionado, setContratoSelecionado] = useState(null);
    const [listaPagamentos, setListaPagamentos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        cod_contrato: "",
        data_pag: "",
        data_vencimento: "",
        descricao: "",
        status_pag: "",
        metodo: "",
        valorPago: ""})


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const criarPagamento = async (e) => {
    e.preventDefault();
    try {
        setLoading(true);
        
        // Validar campos obrigatórios
        if (!formData.data_pag || !formData.valorPago) {
            setError("Data de pagamento e valor são obrigatórios");
            return;
        }

        // Converter datas para formato MySQL (YYYY-MM-DD)
        const formatarData = (data) => {
            if (!data) return null;
            return new Date(data).toISOString().split('T')[0];
        };

        const dadosPagamento = {
            ...formData,
            cod_contrato: contratoSelecionado.cod_cont,
            data_pag: formatarData(formData.data_pag),
            data_vencimento: formatarData(formData.data_vencimento)
        };

        const response = await axios.post(
            `${API_BASE_URL}/advogados/${oab}/Pagamentos`,
            dadosPagamento
        );
        
        console.log("Pagamento criado com sucesso:", response.data);
        setError(null);
        
        // Atualizar listas
        const contAtualizado = await axios.get(`${API_BASE_URL}/advogados/${oab}/Pagamentos`);
        setContratos(contAtualizado.data);
        
        const pagAtualizado = await axios.get(
            `${API_BASE_URL}/advogados/${oab}/Pagamentos/${contratoSelecionado.cod_cont}`
        );
        setListaPagamentos(pagAtualizado.data);
            
        // Resetar formulário e estados
        setMostrarAdd(false);
        setMostrarInfo(false);
        setFormData({
            cod_contrato: "",
            data_pag: "",
            data_vencimento: "",
            descricao: "",
            status_pag: "",
            metodo: "",
            valorPago: ""
        });
        
    } catch (error) {
        console.error("Erro ao criar pagamento:", error);
        setError("Erro ao criar pagamento: " + (error.response?.data?.error || error.message));
    } finally {
        setLoading(false);
    }
};

    const deletarPagamento = async (cod_pagamento) => {
        try {
            const confirmacao = window.confirm("Tem certeza que deseja excluir este pagamento?");
            if (!confirmacao) return;
            setLoading(true);
            const response = await axios.delete(`${API_BASE_URL}/advogados/${oab}/Pagamentos/${cod_pagamento}`);
            console.log("Pagamento deletado com sucesso:", response.data);
            setError(null);
            const contAtualizado = await axios.get(`${API_BASE_URL}/advogados/${oab}/Pagamentos`);
            setContratos(contAtualizado.data);
            const pagAtualizado = await axios.get(`${API_BASE_URL}/advogados/${oab}/Pagamentos/${contratoSelecionado.cod_contrato}`);
                setListaPagamentos(pagAtualizado.data);
            setMostrarInfo(false);
            setMostrarInfoPag(false);
        } catch (error) {   
            console.error("Erro ao deletar pagamento:", error);
            setError("Erro ao deletar pagamento");
        } finally {
            setLoading(false);
        }
    };

    const atualizarPagamento = async (cod_pagamento) => {
    try {
        setLoading(true);
        
        // Converter para formato MySQL (YYYY-MM-DD)
        const formatarData = (data) => {
            if (!data) return null;
            return new Date(data).toISOString().split('T')[0];
        };

        const dadosAtualizados = {
            ...pagamentoSelecionado,
            data_pag: formatarData(pagamentoSelecionado.data_pag),
            data_vencimento: formatarData(pagamentoSelecionado.data_vencimento),
            cod_pag: cod_pagamento
        };

        const response = await axios.put(
            `${API_BASE_URL}/advogados/${oab}/Pagamentos/${cod_pagamento}`, 
            dadosAtualizados
        );
        
        if(response.data.success) {
            // Atualizar a lista de pagamentos antes de fechar
            const pagAtualizado = await axios.get(
                `${API_BASE_URL}/advogados/${oab}/Pagamentos/${contratoSelecionado.cod_cont}`
            );
            setListaPagamentos(pagAtualizado.data);
            
            // Fechar o formulário de edição só depois de atualizar
            setMostrarEdit(false);
            setMostrarInfoPag(true);
        }
    } catch (error) {
        console.error("Erro ao atualizar pagamento:", error);
        setError("Erro ao atualizar pagamento: " + (error.response?.data?.error || error.message));
    } finally {
        setLoading(false);
    }
};

    // Carrega pagamentos quando um contrato é selecionado
    useEffect(() => {
        const listarPagamentos = async () => {
            if (!contratoSelecionado || !contratoSelecionado.cod_cont) return;
            try {
                setLoading(true);
                const response = await axios.get(
                    `${API_BASE_URL}/advogados/${oab}/Pagamentos/${contratoSelecionado.cod_cont}`
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
    }, [API_BASE_URL, oab, contratoSelecionado]); // Atualizado dependências

    // Carrega lista de contratos inicial
    useEffect(() => {
        const carregarContratosComPagamentos = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${API_BASE_URL}/advogados/${oab}/Pagamentos`
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

        carregarContratosComPagamentos();
    }, [API_BASE_URL, oab]);

    useEffect(() => {
            const carregarContratos = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/advogados/${oab}/Contratos`);
                    setContratosAll(response.data);
                } catch (error) {
                    console.error("Erro ao buscar contratos:", error.response?.data || error.message);
                }
            };
            carregarContratos();
    }, [API_BASE_URL, oab]);

    const contratosFiltrados = contratos.filter(contrato => {
    // Defina valores padrão para todos os campos
    const nome = contrato.nome_cliente || '';
    const status = contrato.status_contrato || '';
    const tipo = contrato.tipo_servico || '';
    const statusPag = contrato.status_pag || '';
    const valor = contrato.valor ? contrato.valor.toString() : '';
    const cpf = contrato.CPF ? contrato.CPF.toString() : '';
    
    const buscaLower = busca.toLowerCase();
    
    return (
        nome.toLowerCase().includes(buscaLower) ||
        status.toLowerCase().includes(buscaLower) ||
        tipo.toLowerCase().includes(buscaLower) ||
        statusPag.toLowerCase().includes(buscaLower) ||
        valor.includes(buscaLower) ||
        cpf.includes(buscaLower)
    );
});

    return (
        <div className="container">
            <header className="central">
                <Link to="/advogados"><img src={logo} alt="logo" /></Link>
                <Link to="/advogados"><h1>ADVOCACIA ALMEIDA</h1></Link>

                <nav>
                    <button className="agenda" onClick={() => navigate(`/advogados/${oab}/Agenda`, { replace: true })}>AGENDA</button>
                    <button className="contratos" onClick={() => navigate(`/advogados/${oab}/Contratos`, { replace: true })}>CONTRATOS</button>
                    <button className="processos" onClick={() => navigate(`/advogados/${oab}/Processos`, {replace: true})}>PROCESSOS</button>
                    <button className="pagamentosAtv" onClick={() => navigate(`/advogados/${oab}/Pagamentos`, {replace: true})}>PAGAMENTOS</button>
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
                    <button onClick={()=> {setMostrarContrato(true)}}>ADICIONAR</button>
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
                                <td>{contrato.cod_cont}</td>
                                <td>{contrato.nome_cliente}</td>
                                <td>{contrato.status_contrato}</td>
                                <td>{contrato.tipo_servico}</td>
                                <td>{contrato.status_pag||'ainda não pago'}</td>
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
                                value={contratoSelecionado.cod_cont}
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
                        <button className="voltar" onClick={()=> setMostrarInfo(false)}>VOLTAR</button>
                        <button className="salva" onClick={()=>{setContratoSelecionado(contratoSelecionado); setMostrarInfo(false); setMostrarAdd(true)}}>ADICIONAR</button>
                        
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
                            <button className="editar" onClick={()=> {setMostrarEdit(true); setMostrarInfoPag(false);setPagamentoSelecionado(pagamentoSelecionado)}}>EDITAR</button>
                            <button className="voltar" onClick={()=> {setMostrarInfoPag(false);setMostrarInfo(true)}}>VOLTAR</button>
                            <button className="excluir" onClick={()=> {deletarPagamento(pagamentoSelecionado.cod_pag)}}>EXCLUIR</button>
                        </div>
                    </div>
                )}
                {mostrarContrato && (
                    <div className="aba-contrato-compromisso">
                        <h3>SELECIONE O CONTRATO</h3>
                        <table className="contratos-compromisso">
                      <thead><tr><th>cod</th><th>nome</th><th>status</th><th>tipo</th><th>data de inicio</th><th>valor</th></tr></thead>
                        <tbody>
                        {contratosAll.map((contrato) => (
                            <tr key={contrato.cod_contrato} onClick={() => {setContratoSelecionado(contrato); setMostrarContrato(false); setMostrarAdd(true)}}>
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
                    <div className="adicionar-pagamento">
                        <h3>ADICIONAR PAGAMENTO</h3>
                        <form onSubmit={criarPagamento}>
                        <div className="basico">
                            <label>codigo do contrato <br/>
                            <input
                                type="text"
                                value={contratoSelecionado.cod_contrato || contratoSelecionado.cod_cont}
                                readOnly
                                required
                                name="cod_contrato"
                            />
                            </label>
                            <label > data do pagamento<br/>
                            <input
                                type="date"
                                value={formData.data_pag}
                                onChange={handleChange}
                                name="data_pag"
                            />
                            </label>
                            <label> data de vencimento<br/>
                            <input
                                type="date"
                                value={formData.data_vencimento}
                                onChange={handleChange}
                                name="data_vencimento"
                            /> 
                            </label>
                            <label> status do pagamento<br/>
                            <select name="status_pag" onChange={handleChange} value={formData.status_pag}>
                                <option value=''></option>
                                <option value='concluido'>CONCLUIDO</option>
                                <option value='em andamento'>EM ANDAMENTO</option>
                                <option value='em atraso'>EM ATRASO</option>
                            </select>
                            </label>
                            <label> metodo de pagamento<br/>
                            <select name="metodo" onChange={handleChange} value={formData.metodo}>
                                <option value=''></option>
                                <option value='pix'>PIX</option>
                                <option value='especie'>ESPECIE</option>
                                <option value='parcelado'>PARCELADO</option>
                                <option value='boleto'>BOLETO</option>
                                <option value='credito'>CREDITO</option>
                                <option value='debito'>DEBITO</option>
                            </select>
                            </label>
                            <label> valor pago <br/>
                            <input
                                type="text"
                                value={formData.valorPago}
                                onChange={handleChange}
                                name="valorPago"
                                
                            />
                            </label>
                        </div>
                        <textarea
                        value={formData.descricao}
                        onChange={handleChange}
                        name="descricao"
                        />
                        
                        <div className="botoes">
                                    <button className="voltar" onClick={() => {setMostrarAdd(false); setMostrarContrato(true)}}>VOLTAR</button>
                                 {error && <div className="error-message">{error}</div>}
                                    <button className="salvar" type="submit" disabled={loading} >{loading ? "SALVANDO..." : "SALVAR"}</button>
                        </div>
                        </form>
                    </div>
                )}
                {mostrarEdit && pagamentoSelecionado && (
                    
                    <div className="adicionar-pagamento">
                        <h3>ADICIONAR PAGAMENTO</h3>
                        <form onSubmit={(e) => {e.preventDefault();atualizarPagamento(pagamentoSelecionado.cod_pag);}}>
                        <div className="basico">
                            <label>codigo do contrato <br/>
                            <input
                                type="text"
                                value={pagamentoSelecionado.cod_contrato}
                                readOnly
                                name="cod_contrato"
                            />
                            </label>
                            <label > data do pagamento<br/>
                            <input
                                type="date"
                                value={pagamentoSelecionado.data_pag.split('T')[0]}
                                onChange={(e) => setPagamentoSelecionado({...pagamentoSelecionado,data_pag: e.target.value})}
                                name="data_pag"
                            />
                            </label>
                            <label> data de vencimento<br/>
                            <input
                                type="date"
                                value={pagamentoSelecionado.data_vencimento.split('T')[0]}
                                onChange={(e) => setPagamentoSelecionado({...pagamentoSelecionado,data_vencimento: e.target.value})}
                                name="data_vencimento"
                            /> 
                            </label>
                            <label> status do pagamento<br/>
                            <select name="status_pag" onChange={(e) => setPagamentoSelecionado({...pagamentoSelecionado,status_pag: e.target.value})} value={pagamentoSelecionado.status_pag}>
                                <option value=''></option>
                                <option value='concluido'>CONCLUIDO</option>
                                <option value='em andamento'>EM ANDAMENTO</option>
                                <option value='em atraso'>EM ATRASO</option>
                            </select>
                            </label>
                            <label> metodo de pagamento<br/>
                            <select name="metodo" onChange={(e) => setPagamentoSelecionado({...pagamentoSelecionado,metodo: e.target.value})} value={pagamentoSelecionado.metodo}>
                                <option value=''></option>
                                <option value='pix'>PIX</option>
                                <option value='especie'>ESPECIE</option>
                                <option value='parcelado'>PARCELADO</option>
                                <option value='boleto'>BOLETO</option>
                                <option value='credito'>CREDITO</option>
                                <option value='debito'>DEBITO</option>
                            </select>
                            </label>
                            <label> valor pago <br/>
                            <input
                                type="text"
                                value={pagamentoSelecionado.valorPago}
                                onChange={(e) => setPagamentoSelecionado({...pagamentoSelecionado,valorPago: e.target.value})}
                                name="valorPago"
                                
                            />
                            </label>
                        </div>
                        <textarea
                        value={pagamentoSelecionado.descricao}
                        onChange={(e) => setPagamentoSelecionado({...pagamentoSelecionado,descricao: e.target.value})}
                        name="descricao"
                        />
                        
                        <div className="botoes">
                                    <button className="voltar" onClick={() => {setMostrarEdit(false); setMostrarInfo(true)}}>VOLTAR</button>
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

export default Pagamentos;