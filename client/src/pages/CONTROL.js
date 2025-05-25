import React, { useState } from "react";
import logo from "../public/logo.png";
import "../style/CONTROL.css";
import "../style/global.css";
import { Link, useNavigate } from 'react-router-dom';

const CONTROL = () => {
  // Configuração de segurança
  const LOGIN_PASSWORD = process.env.REACT_APP_LOGIN_PASSWORD || '1234';
  const MAX_ATTEMPTS = 3;
  const LOCKOUT_TIME = 30000; // 30 segundos
  
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      setError(`Tente novamente em ${LOCKOUT_TIME/1000} segundos`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulação de delay para evitar brute force
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (password === LOGIN_PASSWORD) {
        // Login bem-sucedido
        navigate(`/advogados`, { replace: true });
      } else {
        // Login falhou
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= MAX_ATTEMPTS) {
          setIsLocked(true);
          setTimeout(() => {
            setIsLocked(false);
            setAttempts(0);
          }, LOCKOUT_TIME);
          setError(`Muitas tentativas. Tente novamente em ${LOCKOUT_TIME/1000} segundos`);
        } else {
          setError(`Senha incorreta! Tentativas restantes: ${MAX_ATTEMPTS - newAttempts}`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container login-container">
      <header className="login-header">
        <Link to="/">
          <img src={logo} alt="Logo da Advocacia Almeida" />
          <h1>ADVOCACIA ALMEIDA</h1>
        </Link>
      </header>

      <main className="login-main">
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label className="label-control" htmlFor="password">Senha de Acesso<br/>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLocked || loading}
              required
              autoComplete="current-password"
              aria-describedby="passwordHelp"
            />
            </label>
            {error && <div className="error-message" id="passwordHelp">{error}</div>}
          </div>
          
          <button 
            type="submit" 
            disabled={isLocked || loading}
            className="login-button"
          >
            {loading ? "VERIFICANDO..." : "ENTRAR"}
          </button>
        </form>
      </main>

      {/* Rodapé com informações adicionais se necessário */}
      <footer className="login-footer">
        <p>© {new Date().getFullYear()} Advocacia Almeida. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default CONTROL;