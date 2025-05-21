import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../public/logo.png";
import"../style/editaradv.css";
import "../style/global.css";
import { Link, useNavigate, useParams  } from 'react-router-dom';

const EditeAdv = () => {
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  const { oab } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Busca os dados do advogado ao carregar
  useEffect(() => {
    const fetchAdvogado = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/advogados/${oab}`);
        console.log('Dados recebidos:', response.data); // Para debug

        setFormData({
          nome: response.data.nome || '',
          email: response.data.email || '',
          oab: (response.data.OAB || response.data.oab || '').toString().padStart(6, '0'),
          telefone: response.data.telefone || '', // Usa diretamente o campo telefone
          cidade: response.data.cidade || '',
          bairro: response.data.bairro || '',
          logradouro: response.data.logradouro || '',
          uf: response.data.UF || response.data.uf || '',
          numero: response.data.numero || '',
          cep: response.data.CEP || response.data.cep || ''
        });
      } catch (err) {
        setError("Erro ao carregar dados do advogado");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAdvogado();
  }, [API_BASE_URL, oab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        // Validação do OAB
        if (!formData.oab.match(/^\d{6}$/)) {
            throw new Error("OAB deve conter 6 números");
        }

        const response = await axios.put(
            `${API_BASE_URL}/advogados/${oab}`,
            {
                ...formData,
                oab: formData.oab // Envia a OAB mesmo que seja a mesma
            }
        );

        // Se a OAB foi alterada, redireciona para a nova URL
        if (response.data.novaOAB && response.data.novaOAB !== oab) {
            navigate(`/editeadv/${response.data.novaOAB}`, {
                replace: true,
                state: { advogado: formData }
            });
        } else {
            alert("Advogado atualizado com sucesso!");
            navigate("/");
        }
    } catch (err) {
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

      <main className="meio-edite">
        <h3>EDITE O ADVOGADO</h3>


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
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="EMAIL"
                required
              />
              <div className="numeros">
                <input
                  type="text"
                  name="oab"
                  value={formData.oab}
                  onChange={handleChange}
                  pattern="[0-9]{6}"
                  title="Formato: números (ex: 123456)"
                  placeholder="OAB"
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
        <Link to="/">VOLTAR</Link>
      </footer>
    </div>
  );
};

export default EditeAdv;