const express = require('express');
const app = express();
const setUpSwagger = require('./docs/swagger');
const dotenv = require('dotenv');
const errorHandler = require('./utils/errorHandler');

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importando as rotas
const agentesRoutes = require('./routes/agentesRoutes');
const casosRoutes = require('./routes/casosRoutes');

app.use('/agentes', agentesRoutes);
app.use('/casos', casosRoutes);

setUpSwagger(app);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em http://localhost:${PORT}`);
    console.log(`API do Departamento de Polícia rodando em http://localhost:${PORT}/api-docs`);
});