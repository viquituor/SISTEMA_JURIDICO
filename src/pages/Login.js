import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../style/assets/LOGO.png";
import "../style/login.css";
import { Link } from 'react-router-dom';

const Login = () => {
  const [advogados, setAdvogados] = useState([]);
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [advogadoSelecionado, setAdvogadoSelecionado] = useState(null);
  const [busca, setBusca] = useState("");

  // Busca os advogados da API
  useEffect(() => {
    const carregarAdvogados = async () => {
      try {
        const response = await axios.get("http://localhost:3001/advogado");
        setAdvogados(response.data);
      } catch (error) {
        console.error("Erro ao buscar advogados:", error);
      }
    };
    carregarAdvogados();
  }, []);

  // Filtra advogados conforme o texto de busca
  const advogadosFiltrados = advogados.filter(advogado =>
    advogado.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="container">
      <header>
        <img src={logo} alt="logo" />
        <h1>ADVOCACIA ALMEIDA</h1>
      </header>

      <main>
        <div className="titulo">
          <input
            name="BUSCAR"
            placeholder="BUSCAR"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <h3>SELECIONE UM ADVOGADO</h3>
        </div>

        <div className="advs">

            {advogadosFiltrados.map((advogado) => (
              <button
                key={advogado.oab}
                className="adv-nome"
                onClick={() => {
                  setAdvogadoSelecionado(advogado);
                  setMostrarInfo(true);
                }}
              >
                {advogado.nome}
              </button>
              
            ))}
          </div>

          {mostrarInfo && advogadoSelecionado && (
            <div id="hide">
              <button onClick={() => setMostrarInfo(false)}>&times;</button>
              <h1>OAB</h1>
              <p>{advogadoSelecionado.oab}</p>

              <nav>
                <button className="editar">EDITAR</button>
                <button className="entrar">ENTRAR</button>
                <button className="excluir">EXCLUIR</button>
              </nav>
            </div>
          )}
        
      </main>

      <footer>
        <Link to="/CadastroAdv">CADASTRE UM ADVOGADO</Link>
      </footer>
    </div>
  );
};

export default Login;