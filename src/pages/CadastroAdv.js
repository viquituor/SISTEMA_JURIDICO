import logo from "../style/assets/LOGO.png";
import "../style/login.css";
import { Link } from 'react-router-dom';




const CadastroAdv = () => {

  return (
    <div className="container">
      <header>
        <img src={logo} alt="logo" />
        <h1>ADVOCACIA ALMEIDA</h1>
      </header>

      <main>

          <h3>CADASTRE UM ADVOGADO</h3>




      </main>

      <footer>
        <Link to="/">ENTRAR</Link>
      </footer>
    </div>
  );

};
export default CadastroAdv;