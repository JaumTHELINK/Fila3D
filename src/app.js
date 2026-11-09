require('dotenv').config();
const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const clienteRoutes = require('./interfaces/routes/clienteRoutes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/clientes', clienteRoutes);
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
