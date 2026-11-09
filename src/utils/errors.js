class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.status = statusCode;
  }
}

class NaoEncontradoError extends AppError {
  constructor(message = 'Recurso não encontrado.') {
    super(message, 404);
  }
}

class RegraDeNegocioError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class ValidacaoError extends AppError {
  constructor(
    message = 'Erro de validação dos dados de entrada.',
    problemas = [],
  ) {
    super(message, 400);
    this.problemas = problemas;
    this.detalhes = problemas;
    this.issues = problemas;
  }
}

module.exports = {
  AppError,
  NaoEncontradoError,
  RegraDeNegocioError,
  ValidacaoError,
};
