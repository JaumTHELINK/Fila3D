/* Padrão GoF Strategy — ConcreteStrategy para pessoa física */
const PrecoStrategy = require('./PrecoStrategy');

const VALOR_HORA_IMPRESSAO = 50;

class PrecoPessoaFisicaStrategy extends PrecoStrategy {
  calcular(pesoGramas, tempoHoras, precoPorGrama) {
    const total =
      pesoGramas * precoPorGrama + tempoHoras * VALOR_HORA_IMPRESSAO;
    return Math.round(total * 100) / 100;
  }
}

module.exports = PrecoPessoaFisicaStrategy;
