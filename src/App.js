// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import Registro from './screens/Registro';
import Painel from './screens/Painel'; // Crie essa tela!
import Admin from './screens/Admin'; // Crie essa tela!
import PainelAdmin from './screens/PainelAdmin'; // Crie essa tela!
import RecuperarSenha from './screens/RecuperarSenha'; // Crie essa tela!

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/painel" element={<Painel />} /> {/* Novo */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/PainelAdmin" element={<PainelAdmin />} />

        <Route path="/RecuperarSenha" element={<RecuperarSenha />} />

      </Routes>
    </Router>
  );
}

export default App;
