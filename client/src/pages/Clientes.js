import React, {  useEffect, useState } from "react";
import axios from "axios";
import logo from "../public/logo.png";
import "../style/clientes.css";
import "../style/global.css";
import { Link, useParams, useNavigate } from 'react-router-dom';

const Clientes = () => {
    const { oab } = useParams();
    const [clientes, setClientes] = useState([]);
    const [busca, setBusca] = useState("");
    const navigate = useNavigate();
    const [mostrarInfo, setMostrarInfo] = useState(false);
    const [mostrarAdd, setMostrarAdd] = useState(false);
    const [mostrarEdit, setMostarEdit] = useState(false);
    const [clienteSelecionado, setclienteSelecionado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clienteEditado, setClienteEditado] = useState(null);

    const handleEditarCliente = (cliente) => {
      setclienteSelecionado(cliente);
      setClienteEditado({
        ...cliente,
        cpf: cliente.CPF,// Padroniza para minúsculo
        uf: cliente.UF,// Padroniza para minúsculo
        cep: cliente.CEP, // Padroniza para minúsculo
        telefone: cliente.telefones?.[0] || '' // Pega o primeiro telefone
      });
      setMostrarInfo(false);
      setMostarEdit(true);
    };

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        cpf: '',
        telefone: '',
        cidade: '',
        bairro: '',
        logradouro: '',
        uf: '',
        numero: '',
        cep: ''
      });


      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };
      
      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
          // Formatar CPF (remove pontos/traços)
          const cpfFormatado = formData.cpf.replace(/\D/g, '');
          
          if (!cpfFormatado.match(/^[0-9]{11}$/)) {
            throw new Error("CPF deve conter 11 dígitos");
          }
      
          await axios.post(
            `http://localhost:3001/advogados/${oab}/Clientes`,
            { ...formData, cpf: cpfFormatado }
          );
      
          alert("Cliente cadastrado!");
          setMostrarAdd(false);
          // Recarrega a lista
          const res = await axios.get(`http://localhost:3001/advogados/${oab}/Clientes`);
          setClientes(res.data);
        } catch (err) {
          setError(err.response?.data?.error || err.message);
        } finally {
          setLoading(false);
        }
      };


      const handleSubmitEdit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
          if (!clienteEditado) {
            throw new Error("Nenhum cliente selecionado para edição");
          }
      
          // Garante que todos os campos obrigatórios existam
          const dadosAtualizados = {
            nome: clienteEditado.nome || '',
            email: clienteEditado.email || '',
            cpf: clienteEditado.cpf ? clienteEditado.cpf.replace(/\D/g, '') : '',
            telefone: clienteEditado.telefone || '',
            cidade: clienteEditado.cidade || '',
            bairro: clienteEditado.bairro || '',
            logradouro: clienteEditado.logradouro || '',
            uf: clienteEditado.UF ? clienteEditado.uf :'',
            numero: clienteEditado.numero || '',
            cep: clienteEditado.CEP ? clienteEditado.cep : ''
          };
      
          if (!dadosAtualizados.cpf.match(/^[0-9]{11}$/)) {
            throw new Error("CPF deve conter 11 dígitos");
          }
          
          // Envia os dados para o backend
          const response = await axios.put(
            `http://localhost:3001/advogados/${oab}/Clientes/${clienteSelecionado.CPF}`,
            dadosAtualizados
          );
          
          alert(response.data.message || "Cliente atualizado com sucesso!");
          
          // Recarrega a lista
          const res = await axios.get(`http://localhost:3001/advogados/${oab}/Clientes`);
          setClientes(res.data);
          setMostarEdit(false);
        } catch (err) {
          setError(err.response?.data?.error || err.message);
        } finally {
          setLoading(false);
        }
      };

// Função para carregar dados
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

  const excluirCliente = async (cpf) => {
    try {
      const confirmacao = window.confirm("Tem certeza que deseja excluir este cliente?");
      if (!confirmacao) return;
  
      const response = await axios.delete(
        `http://localhost:3001/advogados/${oab}/Clientes/${cpf}`  // Usar CPF como parâmetro
      );
  
      if (response.data.success) {
        alert(response.data.message);
        // Atualiza a lista localmente
        setClientes(clientes.filter(cliente => cliente.CPF !== cpf));
        setMostrarInfo(false);
      }
    } catch (error) {
      const mensagem = error.response?.data?.error || 
        (error.message.includes("contratos associados") 
          ? "Não é possível excluir: cliente possui contratos ativos" 
          : "Erro ao excluir cliente");
      alert(mensagem);
    }
  };

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(busca.toLowerCase())
  );

    return(
        <div className="container">
            <header className="central">
                <Link to="/"><img src={logo} alt="logo" /></Link>
                <Link to="/"><h1>ADVOCACIA ALMEIDA</h1></Link>

                <nav>
                    <button className="agenda" onClick={() => navigate(`/advogados/${oab}/Agenda`, {replace: true})}>AGENDA</button>
                    <button className="contratos" onClick={() => navigate(`/advogados/${oab}/Contratos`, {replace: true})}>CONTRATOS</button>
                    <button className="processos">PROCESSOS</button>
                    <button className="pagamentos">PAGAMENTOS</button>
                    <button className="clientes" onClick={() => navigate (`/advogados/${oab}/Clientes`)}>CLIENTES</button>
                </nav>
            </header>

            <main className="main-clientes">
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

                <div className="cont-cli">
                        {clientesFiltrados.map((cliente) => (
                            <div className="card-cli">
                            <button key={cliente.nome} onClick={() => {setMostrarInfo(true);setclienteSelecionado(cliente);}}>
                                {cliente.nome} <br/>
                            <span>{cliente.CPF}</span></button>
                            </div>
                        ))}


                        {mostrarAdd && (
                            <div className="dados-cli">
                            <h3>CADASTRE O CLIENTE</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="info">
                            <div className="basico">
                              <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                labell='NOME'
                                placeholder="NOME"
                                required
                              />
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                labell='EMAIL'
                                placeholder="EMAIL"
                                required
                              />
                              <div className="numeros">
                                <input
                                  type="text"
                                  name="cpf"
                                  value={formData.CPF}
                                  onChange={handleChange}
                                    labell='CPF'
                                  placeholder="cpf"
                                  required
                                />
                                <input
                                  type="tel"
                                  name="telefone"
                                  value={formData.telefones}
                                  onChange={handleChange}
                                  labell='telefone'
                                  maxLength="11"
                                  placeholder="TEL"
                                  required
                                />
                              </div>
                            </div>
                            
                            <div className="endereco">
                              <input
                                type="text"
                                name="cidade"
                                value={formData.cidade}
                                onChange={handleChange}
                                labell='CIDADE'
                                placeholder="CIDADE"
                                required
                              />
                              <input
                                type="text"
                                name="bairro"
                                value={formData.bairro}
                                onChange={handleChange}
                                labell='BAIRRO'
                                placeholder="BAIRRO"
                                required
                              />
                              <input
                                type="text"
                                name="logradouro"
                                value={formData.logradouro}
                                onChange={handleChange}
                                labell='LOGRADOURO'
                                placeholder="LOGRADOURO"
                                required
                              />
                            </div>
                            
                            <div className="numeros">
                              <input
                                type="text"
                                name="uf"
                                value={formData.UF}
                                onChange={handleChange}
                                labell='UF'
                                maxLength="2"
                                placeholder="UF"
                                required
                              />
                              <input
                                type="text"
                                name="numero"
                                value={formData.numero}
                                onChange={handleChange}
                                labell='NUMERO'
                                placeholder="NUMERO"
                                required
                              />
                              <input
                                type="text"
                                name="cep"
                                value={formData.CEP}
                                onChange={handleChange}
                                labell='CEP'
                                maxLength="8"
                                placeholder="CEP"
                                required
                              />
                            </div>
                            </div>
                            <div className="botoes"
                            >
                            <button className="voltar" onClick={() => setMostrarAdd(false)} >VOLTAR</button>
                                {error && <div className="error-message">{error}</div>}
                                <button className="salvar" type="submit" disabled={loading} >{loading ? "SALVANDO..." : "SALVAR"}</button>
                    
                            </div>
                            </form>

                          </div>
                        )}

                        {mostrarInfo && clienteSelecionado && (
                            <div className="dados-cli">
                            <h3>INFORMAÇÕES DO CLIENTE</h3>
                                <div className="info">
                            <div className="basico">
                              <input
                                type="text"
                                name="nome"
                                value={clienteSelecionado.nome}
                                labell='NOME'
                                placeholder="NOME"
                                required
                              />
                              <input
                                type="email"
                                name="email"
                                value={clienteSelecionado.email}
                                labell='EMAIL'
                                placeholder="EMAIL"
                                required
                              />
                              <div className="numeros">
                                <input
                                  type="text"
                                  name="cpl"
                                  value={clienteSelecionado.CPF}
                                    labell='CPF'
                                  placeholder="cpf"
                                  required
                                />
                                <input
                                  type="tel"
                                  name="telefone"
                                  value={clienteSelecionado.telefones}
                                    labell='telefone'
                                  maxLength="11"
                                  placeholder="TEL"
                                  required
                                />
                              </div>
                            </div>
                            
                            <div className="endereco">
                              <input
                                type="text"
                                name="cidade"
                                value={clienteSelecionado.cidade}
                                labell='CIDADE'
                                placeholder="CIDADE"
                                required
                              />
                              <input
                                type="text"
                                name="bairro"
                                value={clienteSelecionado.bairro}
                                labell='BAIRRO'
                                placeholder="BAIRRO"
                                required
                              />
                              <input
                                type="text"
                                name="logradouro"
                                value={clienteSelecionado.logradouro}
                                labell='LOGRADOURO'
                                placeholder="LOGRADOURO"
                                required
                              />
                            </div>
                            
                            <div className="numeros">
                              <input
                                type="text"
                                name="uf"
                                value={clienteSelecionado.UF}
                                labell='UF'
                                maxLength="2"
                                placeholder="UF"
                                required
                              />
                              <input
                                type="text"
                                name="numero"
                                value={clienteSelecionado.numero}
                                labell='NUMERO'
                                placeholder="NUMERO"
                                required
                              />
                              <input
                                type="text"
                                name="cep"
                                value={clienteSelecionado.CEP}
                                labell='CEP'
                                maxLength="8"
                                placeholder="CEP"
                                required
                              />
                            </div>
                            </div>
                            <div className="botoes">
                                <button className="editar" onClick={() => handleEditarCliente(clienteSelecionado)} >EDITAR</button>
                                <button className="voltar" onClick={() => setMostrarInfo(false)} >VOLTAR</button>
                                <button className="excluir" onClick={() => excluirCliente(clienteSelecionado.CPF)} >EXCLUIR</button>
                            </div>


                          </div>

                          
                        )}

                        {mostrarEdit && clienteSelecionado && (

                          <div className="dados-cli-edit">
                          <h3>EDITE AS INFORMAÇÕES</h3>
                          <form onSubmit={handleSubmitEdit}>
                              <div className="edit-cli">
                          <div className="basico">
                            <input
                              type="text"
                              name="nome"
                              value={clienteEditado.nome}
                              onChange={(e) => setClienteEditado({...clienteEditado, nome: e.target.value})}
                              label='NOME'
                              placeholder="NOME"
                              required
                            />
                            <input
                              type="email"
                              name="email"
                              value={clienteEditado.email}
                              onChange={(e) => setClienteEditado({...clienteEditado, email: e.target.value})}
                              label='EMAIL'
                              placeholder="EMAIL"
                              required
                            />
                            <div className="numeros">
                              <input
                                type="text"
                                name="cpf"
                                value={clienteEditado.cpf}
                                onChange={(e) => setClienteEditado({...clienteEditado, cpf: e.target.value})}
                                label='CPF'
                                placeholder="cpf"
                                required
                              />
                              <input
                                type="tel"
                                name="telefone"
                                value={clienteEditado.telefone}
                                onChange={(e) => setClienteEditado({...clienteEditado, telefone: e.target.value})}
                                label='telefone'
                                maxLength="11"
                                placeholder="TEL"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="endereco">
                            <input
                              type="text"
                              name="cidade"
                              value={clienteEditado.cidade}
                              onChange={(e) => setClienteEditado({...clienteEditado, cidade: e.target.value})}
                              label='CIDADE'
                              placeholder="CIDADE"
                              required
                            />
                            <input
                              type="text"
                              name="bairro"
                              value={clienteEditado.bairro}
                              onChange={(e) => setClienteEditado({...clienteEditado, bairro: e.target.value})}
                              label='BAIRRO'
                              placeholder="BAIRRO"
                              required
                            />
                            <input
                              type="text"
                              name="logradouro"
                              value={clienteEditado.logradouro}
                              onChange={(e) => setClienteEditado({...clienteEditado, logradouro: e.target.value})}
                              label='LOGRADOURO'
                              placeholder="LOGRADOURO"
                              required
                            />
                          </div>
                          
                          <div className="numeros">
                            <input
                              type="text"
                              name="uf"
                              value={clienteEditado.uf}
                              onChange={(e) => setClienteEditado({...clienteEditado, uf: e.target.value})}
                              label='UF'
                              maxLength="2"
                              placeholder="UF"
                              required
                            />
                            <input
                              type="text"
                              name="numero"
                              value={clienteEditado.numero}
                              onChange={(e) => setClienteEditado({...clienteEditado, numero: e.target.value})}
                              label='NUMERO'
                              placeholder="NUMERO"
                              required
                            />
                            <input
                              type="text"
                              name="cep"
                              value={clienteEditado.cep}
                              onChange={(e) => setClienteEditado({...clienteEditado, cep: e.target.value})}
                              label='CEP'
                              maxLength="8"
                              placeholder="CEP"
                              required
                            />
                          </div>
                          </div>
                          <div className="botoes"
                          >
                          <button className="voltar" onClick={() => {setMostarEdit(false); setMostrarInfo(true)}} >VOLTAR</button>
                              {error && <div className="error-message">{error}</div>}
                              <button className="salvar" type="submit" disabled={loading} >{loading ? "SALVANDO..." : "SALVAR"}</button>
                  
                          </div>
                          </form>

                        </div>
                      
                        )}
                     
                </div> 
            </main>
        </div>
    );
};

export default Clientes;