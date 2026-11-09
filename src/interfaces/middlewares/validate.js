const { ValidacaoError } = require('../../utils/errors');

function validate(schema, origem = 'body') {
  return (req, res, next) => {
    const dados = req[origem];
    const resultado = schema.safeParse(dados);

    if (!resultado.success) {
      const problemas = resultado.error.issues.map((issue) => ({
        campo: issue.path.join('.') || origem,
        mensagem: issue.message,
      }));

      const erro = new ValidacaoError(
        'Erro de validação dos dados de entrada.',
        problemas,
      );
      erro.issues = problemas;
      erro.detalhes = problemas;

      return next(erro);
    }

    req[origem] = resultado.data;
    return next();
  };
}

module.exports = validate;

