const express = require('express');
const cors = require('cors');
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const advogadosRouter = require('./routes/advogados');
const clientesRouter = require('./routes/Clientes'); 
const contratosRouter = require('./routes/Contratos');
const PagamentosRouter = require('./routes/Pagamentos');
const agendaRouter = require('./routes/Agenda');
const ProcessosRouter = require('./routes/Processos')
const PrazoRouter = require('./routes/PrazoPro')
const errorHandler = require('./middlewares/errorHandler');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const app = express();

// Middlewares
app.use(cors({
  origin: [`${API_BASE_URL}`], // Ambientes permitidos
  credentials: true
}));

app.use((req, res, next) => {
  console.log(`Recebida requisição para: ${req.method} ${req.path}`);
  next();
});


app.use(express.json());

// Rotas
app.use('/advogados', advogadosRouter);
app.use('/advogados/:oab/', clientesRouter);
app.use('/advogados/:oab/', contratosRouter );
app.use('/advogados/:oab/', agendaRouter);
app.use('/advogados/:oab/', PagamentosRouter);
app.use('/advogados/:oab/', ProcessosRouter );
app.use('/advogados/:oab/',PrazoRouter)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Tratamento de erros
app.use(errorHandler);


// Configuração do Multer para armazenamento organizado
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { cod_contrato } = req.params;
    const uploadDir = path.join(__dirname, 'uploads', `contrato_${cod_contrato}`);
    
    // Cria o diretório se não existir
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Remove caracteres especiais e espaços do nome do arquivo
    const nomeLimpo = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + nomeLimpo);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Servir arquivos estáticos

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;