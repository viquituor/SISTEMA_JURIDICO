const express = require('express');
const cors = require('cors');
const advogadosRouter = require('./routes/advogados');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/advogados', advogadosRouter);

// Tratamento de erros
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;