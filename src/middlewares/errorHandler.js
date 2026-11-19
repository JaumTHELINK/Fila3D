// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status =
    err.code === 'P2002' ? 400 : err.statusCode || err.status || 500;
  const mensagem =
    status === 500
      ? 'Erro interno do servidor'
      : err.code === 'P2002'
        ? 'Já existe um registro com esses dados.'
        : err.message;

  if (status === 500) console.error(err);

  const resposta = { erro: mensagem };
  if (status !== 500 && Array.isArray(err.problemas)) {
    resposta.problemas = err.problemas;
  }

  res.status(status).json(resposta);
}

module.exports = errorHandler;
