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
    const [documentos, setDocumentos] = useState([]);
    const [pagamentos, setPagamentos] = useState([]);
    const [compromissos, setCompromissos] = useState([]);
    const [cod_contratoSelecionado, setCod_contratoSelecionado] = useState(null);
    const [contratoSelecionado, setContratoSelecionado] = useState(null);
    const [mostrarInfo, setMostrarInfo] = useState(false);
    const [mostrarAdd, setMostrarAdd] = useState(false);
    const [mostrarEdit, setMostrarEdit] = useState(false);
    const [mostrarAddDocumento, setMostrarAddDocumento] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [formData, setFormData] = useState({
        OAB:oab,
        CPF:'',
        data_inicio:'',
        tipo_servico:'',
        status_contrato:'',
        descricao:'',
        valor:''
        });

    const excluirContrato = async (cod_contrato) => {
        try {
          const confirmacao = window.confirm("Tem certeza que deseja excluir este contrato?");
          if (!confirmacao) return;
      
          const response = await axios.delete(`http://localhost:3001/advogados/${oab}/Contratos/${cod_contrato}`);
      
          if (response.data.success) {
            alert(response.data.message);
            // Atualiza a lista localmente
            const res = await axios.get(`http://localhost:3001/advogados/${oab}/Contratos`);
            setContratos(res.data);
            setMostrarInfo(false);
          }
        } catch (error) {
          const mensagem = error.response?.data?.error || 
            (error.message.includes("contratos associados" ) ? "Não é possível excluir o contrato" : error.message);
          alert(mensagem);
        }
        };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        };

    const handleEdit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {          
          await axios.put(`http://localhost:3001/advogados/${oab}/Contratos/${cod_contratoSelecionado}`, formData);
      
          alert("contrato editado!");
          setMostrarEdit(false);
          // Recarrega a lista
          const res = await axios.get(`http://localhost:3001/advogados/${oab}/Contratos`);
          setContratos(res.data);
        } catch (err) {
          setError(err.response?.data?.error || err.message);
        } finally {
          setLoading(false);
        }
        };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {          
          await axios.post(`http://localhost:3001/advogados/${oab}/Contratos`, formData);
      
          alert("contrato cadastrado!");
          setMostrarAdd(false);
          // Recarrega a lista
          const res = await axios.get(`http://localhost:3001/advogados/${oab}/Contratos`);
          setContratos(res.data);
          setFormData({
            OAB:oab,
            CPF:'',
            data_inicio:'',
            tipo_servico:'',
            status_contrato:'',
            descricao:'',
            valor:''
        });
        } catch (err) {
          setError(err.response?.data?.error || err.message);
        } finally {
          setLoading(false);
        }
        };

    const addDoc = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('documento', e.target.documento.files[0]);

  try {
    setLoading(true);
    setUploadProgress(0);
    
    await axios.post(
      `http://localhost:3001/advogados/${oab}/Contratos/${cod_contratoSelecionado}/doc`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      }
    );

    // Atualiza a lista de documentos
    const res = await axios.get(
      `http://localhost:3001/advogados/${oab}/Contratos/${cod_contratoSelecionado}`
    );
    setDocumentos(res.data.documentos);
    
    alert('Documento adicionado com sucesso!');
    setMostrarAddDocumento(false);
  } catch (error) {
    console.error('Erro no upload:', error);
    alert(error.response?.data?.error || 'Erro ao enviar documento');
  } finally {
    setLoading(false);
    setUploadProgress(0);
  }
        };

    const excluirDocumento = async (cod_doc) => {
  try {
    const confirmacao = window.confirm("Tem certeza que deseja excluir este documento?");
    if (!confirmacao) return;

    await axios.delete(
      `http://localhost:3001/advogados/${oab}/documentos/${cod_doc}`
    );
    
    // Atualiza a lista de documentos
    const res = await axios.get(
      `http://localhost:3001/advogados/${oab}/Contratos/${cod_contratoSelecionado}`
    );
    setDocumentos(res.data.documentos);
    
    alert('Documento excluído com sucesso!');
  } catch (error) {
    console.error('Erro ao excluir documento:', error);
    alert('Erro ao excluir documento');
  }
        };

    useEffect(() => {
        const carregarClientes = async () => {
          try {
            const response = await axios.get(`http://localhost:3001/advogados/${oab}/Clientes`);
            setClientes(response.data);
          } catch (error) {
            console.error("Erro ao buscar advogados:", error);
          }
        };
        carregarClientes();
        }, [oab]);

    useEffect(() => {
            const carregarListas = async () => {
                try {
                    if (cod_contratoSelecionado) {
                        const response = await axios.get(`http://localhost:3001/advogados/${oab}/Contratos/${cod_contratoSelecionado}`);

            setDocumentos(response.data.documentos);
            setPagamentos(response.data.pagamentos);
            setCompromissos(response.data.compromissos);
                }
            } catch (error) {
                console.error("Erro ao buscar agenda:", error.response?.data || error.message);
                }
            }
        carregarListas();
        }, [cod_contratoSelecionado, oab]);

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
        contrato.nome_cliente.toLowerCase().includes(busca.toLowerCase()) ||
        contrato.status_contrato.toLowerCase().includes(busca.toLowerCase()) ||
        contrato.tipo_servico.toLowerCase().includes(busca.toLowerCase()) ||
        contrato.data_inicio.toLowerCase().includes(busca.toLowerCase()) ||
        contrato.valor.toString().includes(busca.toLowerCase())||
        contrato.CPF.toString().includes(busca.toLowerCase())
        );



    return(
        <div className="container">
            <header className="central">
                <Link to="/"><img src={logo} alt="logo" /></Link>
                <Link to="/"><h1>ADVOCACIA ALMEIDA</h1></Link>

                <nav>
                    <button className="agenda" onClick={() => navigate(`/advogados/${oab}/Agenda`, {replace: true})}>AGENDA</button>
                    <button className="contratosAtv" onClick={() => navigate(`/advogados/${oab}/Contratos`, {replace: true})}>CONTRATOS</button>
                    <button className="processos" onClick={() => navigate(`/advogados/${oab}/Processos`, {replace: true})}>PROCESSOS</button>
                    <button className="pagamentos" onClick={() => navigate(`/advogados/${oab}/Pagamentos`, {replace: true})}>PAGAMENTOS</button>
                    <button className="clientes" onClick={() => navigate (`/advogados/${oab}/Clientes`, {replace: true})}>CLIENTES</button>
                </nav>
            </header>

            <main className="main-contrato">
            <div className="buscar-add">
                    <input
                        name="input-busca"
                        type="text"
                        placeholder="Buscar"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                    <button onClick={() => setMostrarAdd(true)}>ADICIONAR</button>
                </div>
                <div className="tabela-contrato">
                    <table>
                      <thead><tr><th>codigo</th><th>nome</th><th>status</th><th>tipo</th><th>data de inicio</th><th>valor</th></tr></thead>
                        <tbody>
                        {contratosFiltrados.map((contrato) => (
                            <tr key={contrato.cod_contrato} onClick={() => {setMostrarInfo(true) ;setContratoSelecionado(contrato); setCod_contratoSelecionado(contrato.cod_contrato)}}>
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
                    {mostrarInfo && contratoSelecionado && cod_contratoSelecionado && (
                        <div className="aba">
                            <h3>INFORMAÇÕES DO CONTRATO</h3>
                            <div className="info-contrato">
                                <div className="colunas">
                                <div className="inputes">
                                <div className="basico">
                                    <label>
                                        nome do cliente<br/>
                                        <input
                                        name="nome_cliente"
                                        defaultValue={contratoSelecionado.nome_cliente}
                                        readOnly
                                    />
                                    </label>
                                    <label>
                                        cpf<br/>
                                        <input
                                        name="CPF"
                                        defaultValue={contratoSelecionado.CPF}
                                        readOnly
                                    />
                                    </label>
                                    <label>
                                        nome do advogado<br/>
                                        <input
                                        name="nome_advogado"
                                        defaultValue={contratoSelecionado.nome_advogado}
                                        readOnly
                                    />
                                    </label>
                                    <label>
                                        oab<br/>
                                        <input
                                        name="OAB"
                                        defaultValue={contratoSelecionado.OAB}
                                        readOnly
                                    />
                                    </label>

                                    
                                </div>
                                <div className="dados">
                                    <label>
                                        Tipo de serviço<br/>
                                        <input
                                        name="tipo_servico"
                                        defaultValue={contratoSelecionado.tipo_servico}
                                        readOnly
                                    />
                                    </label>
                                    <label>
                                    Status do contrato<br/>
                                    <input
                                        name="status_contrato"
                                        defaultValue={contratoSelecionado.status_contrato}
                                        readOnly
                                    />
                                    </label>
                                    <label>
                                    Valor do contrato<br/>
                                    <input
                                        name="valor"
                                        defaultValue={contratoSelecionado.valor}
                                        readOnly
                                    />
                                    </label>

                                    <label>
                                        data de inicio<br/>
                                        <input
                                        name="data_inicio"
                                        defaultValue={new Date (contratoSelecionado.data_inicio).toLocaleDateString()}
                                        readOnly
                                    />
                                    </label>
                                    
                                    
                                </div>
                                </div>
                                
                                <textarea
                                        className="descricao"
                                        name="descricao"
                                        defaultValue={contratoSelecionado.descricao}
                                        readOnly
                                    />

                                    <button className="doc" onClick={()=> {setMostrarAddDocumento(true);setMostrarInfo(false)}} >adicionar documentos</button>
                                    
                               </div>
                                <div className="listas">
                                    <ul>
                                         <h4>DOCUMENTOS <br/> <em>clique para baixar</em></h4>
                                    {documentos.map((documento) => (
                                        <li key={documento.cod_doc}>
                            <a href={`http://localhost:3001${documento.link}`} target="_blank" rel="noopener noreferrer" download={documento.nome}>
                                         {documento.nome}
                            </a>
                            <button className="red" onClick={() => excluirDocumento(documento.cod_doc)}>x</button>
    </li>
                                    ))}
                                    </ul>

                                    <ul>
                                    <h4>PAGAMENTOS</h4>
                                    {pagamentos.map((listaPag) => (
                                                <li key={listaPag.cod_pag}>
                                                    {listaPag.valorPago} - {new Date(listaPag.data_pag).toLocaleDateString()} - {listaPag.metodo}
                                                </li>
                                            ))}
                                    </ul>
                                    
                                    <ul>
                                    <h4>compromissos</h4>
                                        {compromissos.map((agenda) => (
                                                <li key={agenda.cod_compromisso}>
                                                    {agenda.nome_compromisso} - {new Date(agenda.data_compromisso).toLocaleDateString()} - {agenda.status_compromisso}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="botoes">
                                <button className="editar" onClick={() => {setMostrarEdit(true); setMostrarInfo(false);setFormData({...contratoSelecionado,OAB:oab})}}>EDITAR</button>
                                <button className="voltar" onClick={() => setMostrarInfo(false)}>VOLTAR</button>
                                <button className="excluir" onClick={() => excluirContrato(contratoSelecionado.cod_contrato)} >EXCLUIR</button>
                            </div>
                        </div>
                    )}
                    {mostrarAdd &&(
                        <div className="aba-add">
                            <h1>CRIE UM CONTRATO</h1>

                            <form onSubmit={handleSubmit} className="form-add">
                                <div className="form-cont">
                                        <div className="basico">
                                <input
                                    name="OAB"
                                    defaultValue={oab}
                                    onChange={handleChange}
                                    value={oab}
                                    readOnly
                                    required
                                />

                                <select name="CPF" onChange={handleChange} value={formData.CPF} required>
                                    <option value="" >-Nome do cliente-</option>
                                    {clientes.map((cliente) => (
                                        <option key={cliente.CPF} value={cliente.CPF}>{cliente.nome}</option>
                                    ))}
                                </select>

                                <input
                                    name="data_inicio"
                                    type="date"
                                    onChange={handleChange}
                                    value={formData.data_inicio}
                                    required
                                />
                                <input
                                    name="valor"
                                    onChange={handleChange}
                                    value={formData.valor}
                                    placeholder="Valor do contrato"
                                    required
                                />
                                    </div>
                                        <div className="tipo-desc">
                                    <div className="tipo">
                                
                                <select name="tipo_servico" placeholder="Tipo de serviço" onChange={handleChange} value={formData.tipo_servico} required>
                                        <option value="">-Tipo de serviço-</option>
                                        <option value="civil">civil</option>
                                        <option value="trabalho">trabalho</option>
                                        <option value="previdenciario">previdenciario</option>
                                        <option value="criminal">criminal</option>
                                        <option value="consumidor">consumidor</option>
                                        <option value="assesoria e consultoria">assesoria e consultoria</option>
                                        <option value="acompanhamentos">acompanhamentos</option>
                                        <option value="correspondencia juridica">correspondencia juridica</option>
                                        
                                 </select>

                                <select name="status_contrato" placeholder="Status do contrato" onChange={handleChange} value={formData.status_contrato} required>
                                        <option value="">-Status do contrato-</option>
                                        <option value="ganho">GANHO</option>
                                        <option value="perdido">PERDIDO</option>
                                        <option value="cancelado">CANCELADO</option>
                                        <option value="em andamento">EM ANDAMENTO</option>
                                 </select>
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

                                    </div>
                                </div>

                                <div className="botoes">
                                    <button className="voltar" onClick={() => setMostrarAdd(false)}>VOLTAR</button>
                                 {error && <div className="error-message">{error}</div>}
                                    <button className="salvar" type="submit" disabled={loading} >{loading ? "SALVANDO..." : "SALVAR"}</button>
                                </div>
                            </form>
                            
                        </div>
                    )}
                    {mostrarEdit && contratoSelecionado && (
                     
                     <div className="aba-edit">
                     <h3>EDITE O CONTRATO</h3>

                     <form onSubmit={handleEdit} className="form-add">
                         <div className="form-cont">
                                 <div className="basico">
                         <input
                             name="OAB"
                             defaultValue={oab}
                             onChange={handleChange}
                             value={oab}
                             readOnly
                             required
                         />

                         <select name="CPF" onChange={handleChange} value={formData.CPF} required>
                             <option value="" >-Nome do cliente-</option>
                             {clientes.map((cliente) => (
                                 <option key={cliente.CPF} value={cliente.CPF}>{cliente.nome}</option>
                             ))}
                         </select>

                         <input
                             name="data_inicio"
                             type="date"
                             onChange={handleChange}
                             value={formData.data_inicio.split('T')[0]}
                             required
                         />
                         <input
                             name="valor"
                             onChange={handleChange}
                             value={formData.valor}
                             placeholder="Valor do contrato"
                             required
                         />
                             </div>
                                 <div className="tipo-desc">
                             <div className="tipo">
                         
                         <select name="tipo_servico" placeholder="Tipo de serviço" onChange={handleChange} value={formData.tipo_servico} required>
                                 <option value="">-Tipo de serviço-</option>
                                 <option value="civil">civil</option>
                                 <option value="trabalho">trabalho</option>
                                 <option value="previdenciario">previdenciario</option>
                                 <option value="criminal">criminal</option>
                                 <option value="consumidor">consumidor</option>
                                 <option value="assesoria e consultoria">assesoria e consultoria</option>
                                 <option value="acompanhamentos">acompanhamentos</option>
                                 <option value="correspondencia juridica">correspondencia juridica</option>
                                 
                          </select>

                         <select name="status_contrato" placeholder="Status do contrato" onChange={handleChange} value={formData.status_contrato} required>
                                 <option value="">-Status do contrato-</option>
                                 <option value="ganho">GANHO</option>
                                 <option value="perdido">PERDIDO</option>
                                 <option value="cancelado">CANCELADO</option>
                                 <option value="em andamento">EM ANDAMENTO</option>
                          </select>
                         </div>
                         <textarea
                             className="descricao"
                             name="descricao"
                             onChange={handleChange}
                             value={formData.descricao||''}
                             type="text"
                             placeholder="Descrição do contrato"
                             required
                         />
                     
                             </div>
                         </div>

                         <div className="botoes">
                             <button className="voltar" onClick={() => {setMostrarEdit(false); setMostrarInfo(true)}}>VOLTAR</button>
                          {error && <div className="error-message">{error}</div>}
                             <button className="salvar" type="submit" disabled={loading} >{loading ? "SALVANDO..." : "SALVAR"}</button>
                         </div>
                     </form>
                     
                 </div>
                
                    )}
                    {mostrarAddDocumento && contratoSelecionado && (
                        <div className="addDoc">
                            <h1>ADICIONE UM DOCUMENTO</h1>
                            <form className="form-add" onSubmit={addDoc}>
                                <input
                                    type="file"
                                    name="documento"
                                    required
                                />


                                <div className="botoes">
                                {error && <div className="error-message">{error}</div>}
                             <button className="salvar" type="submit" disabled={loading} >{loading ? "SALVANDO..." : "ADICIONAR"}</button>
                                <button onClick={() => {setMostrarAddDocumento(false); setMostrarInfo(true)}}>VOLTAR</button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>



                
            </main>
        </div>
    );
};

export default Contratos;