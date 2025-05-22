import React, { useState } from "react";
import axios from "axios";
import logo from "../public/logo.png";
import "../style/CadastroAdv.css"
import "../style/global.css";
import { Link, useNavigate } from 'react-router-dom';

const CadastroAdv = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    oab: '',
    telefone: '',
    cidade: '',
    bairro: '',
    logradouro: '',
    uf: '',
    numero: '',
    cep: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validação do frontend (OAB)
      if (!formData.oab.match(/^[0-9]{6}$/)) {
        throw new Error("OAB deve conter 6 números (ex: 123456)");
      }
      
      // Envia os dados para o backend
      const response = await axios.post(`${API_BASE_URL}/advogados`, formData);
      
      // Feedback para o usuário
      alert(response.data.message || "Cadastro realizado com sucesso!");
      navigate("/"); // Redireciona
    } catch (err) {
      // Exibe erros do backend ou da conexão
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <Link to="/"><img src={logo} alt="logo" /></Link>
        <Link to="/"><h1>ADVOCACIA ALMEIDA</h1></Link>
      </header>

      <main className="meio-adv">
        <h3>CADASTRE UM ADVOGADO</h3>


        <form onSubmit={handleSubmit}>
          <div className="dados-adv">
            <div className="basico">
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="NOME"
                required
              />
              <input
                type="email"
                name="email-adv"
                value={formData.email}
                onChange={handleChange}
                placeholder="EMAIL"
                required
              />
              <div className="numeros-adv">
                <input
                  type="text"
                  name="oab"
                  value={formData.oab}
                  onChange={handleChange}
                  placeholder="OAB"
                  pattern="[0-9]]{6}"
                  title="Formato:6 números (ex: 123456)"
                  required
                />
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
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
                placeholder="CIDADE"
                required
              />
              <input
                type="text"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                placeholder="BAIRRO"
                required
              />
              <input
                type="text"
                name="logradouro"
                value={formData.logradouro}
                onChange={handleChange}
                placeholder="LOGRADOURO"
                required
              />
            </div>
            
            <div className="numeros">
              <input
                type="text"
                name="uf"
                value={formData.uf}
                onChange={handleChange}
                maxLength="2"
                placeholder="UF"
                required
              />
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                placeholder="NUMERO"
                required
              />
              <input
                type="text"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                maxLength="8"
                placeholder="CEP"
                required
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading}>
            {loading ? "SALVANDO..." : "SALVAR"}
          </button>
        </form>
      </main>

      <footer>
        <Link to="/">ADVOGADO JÁ CADASTRATO</Link>
      </footer>
    </div>
  );
};

export default CadastroAdv;