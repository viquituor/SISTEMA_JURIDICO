const express = require('express');
const cors = require('cors');
const advogadosRouter = require('./routes/advogados');
const clientesRouter = require('./routes/Clientes'); 
const contratosRouter = require('./routes/Contratos');
const PagamentosRouter = require('./routes/Pagamentos');
const agendaRouter = require('./routes/Agenda');
const errorHandler = require('./middlewares/errorHandler');


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/advogados', advogadosRouter);
app.use('/advogados/:oab/', clientesRouter);
app.use('/advogados/:oab/', contratosRouter );
app.use('/advogados/:oab/', agendaRouter);
app.use('/advogados/:oab/', PagamentosRouter);


// Tratamento de erros
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;