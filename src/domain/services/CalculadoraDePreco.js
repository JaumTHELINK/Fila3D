/* Padrão GoF Strategy — Context que delega o cálculo para a strategy */
class CalculadoraDePreco {
  constructor(strategy) {
    if (!strategy || typeof strategy.calcular !== 'function') {
      throw new Error('Uma PrecoStrategy deve ser fornecida à calculadora.');
    }
    this.strategy = strategy;
  }

  calcular(pesoGramas, tempoHoras, precoPorGrama) {
    return this.strategy.calcular(pesoGramas, tempoHoras, precoPorGrama);
  }
}

module.exports = CalculadoraDePreco;
