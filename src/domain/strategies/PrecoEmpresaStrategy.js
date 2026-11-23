/* Padrão GoF Strategy — ConcreteStrategy para empresa
   (desconto de 15% sobre o valor base) */
const PrecoStrategy = require('./PrecoStrategy');

const VALOR_HORA_IMPRESSAO = 50;
const FATOR_DESCONTO_EMPRESA = 0.85;

class PrecoEmpresaStrategy extends PrecoStrategy {
  calcular(pesoGramas, tempoHoras, precoPorGrama) {
    const base = pesoGramas * precoPorGrama + tempoHoras * VALOR_HORA_IMPRESSAO;
    return Math.round(base * FATOR_DESCONTO_EMPRESA * 100) / 100;
  }
}

module.exports = PrecoEmpresaStrategy;
