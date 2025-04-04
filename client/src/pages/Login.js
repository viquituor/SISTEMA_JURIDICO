import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../public/logo.png";
import "../style/login.css";
import "../style/global.css";
import { Link, useNavigate} from 'react-router-dom';

const Login = () => {
  const [advogados, setAdvogados] = useState([]);
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [advogadoSelecionado, setAdvogadoSelecionado] = useState(null);
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();

  // Busca os advogados da API
  useEffect(() => {
    const carregarAdvogados = async () => {
      try {
        const response = await axios.get("http://localhost:3001/advogados");
        setAdvogados(response.data);
      } catch (error) {
        console.error("Erro ao buscar advogados:", error);
      }
    };
    carregarAdvogados();
  }, []);

  const excluirAdvogado = async (oab) => {
    try{
        const confirmacao = window.confirm("tem certeza que deseja excluir este advogado?");
        if(!confirmacao) return;

        const response = await axios.delete(`http://localhost:3001/advogados/${oab}`);

        if(response.data.success){
          alert(response.data.message);

          const updatedAdvogados = advogados.filter(adv => adv.oab !== oab);
          setAdvogados(updatedAdvogados);
          setMostrarInfo(false);
        }
    }catch(error){
      console.error("Erro ao excluir advogado", error);
      alert(error.response?.data?.error || "Erro ao excluir advogado");
    }
  };

  // Filtra advogados conforme o texto de busca
  const advogadosFiltrados = advogados.filter(advogado =>
    advogado.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="container">
      <header>
        <Link to="/"><img src={logo} alt="logo" /></Link>
        <Link to="/"><h1>ADVOCACIA ALMEIDA</h1></Link>
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
                {advogado.nome.toUpperCase()}
              </button>
              
            ))}
          </div>

          {mostrarInfo && advogadoSelecionado && (
            <div id="hide" className="hide">
              <button className="exit" onClick={() => setMostrarInfo(false)}>&times;</button>
              <div className="conteudo">
              <h1>{advogadoSelecionado.nome}</h1>
              <p>OAB<br/>{advogadoSelecionado.OAB}</p>

              <nav>
                <button className="editar" onClick={() => navigate(`/EditeAdv/${advogadoSelecionado.OAB}`, {state: {advogado: advogadoSelecionado}})}>EDITAR</button>
                <button className="entrar">ENTRAR</button>
                <button className="excluir" onClick={() => excluirAdvogado(advogadoSelecionado.OAB)}>EXCLUIR</button>
              </nav>
              </div>
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