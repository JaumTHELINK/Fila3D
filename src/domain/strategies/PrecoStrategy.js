/* Padrão GoF Strategy — define a interface comum para todos os
   algoritmos de cálculo de preço */
class PrecoStrategy {
  // eslint-disable-next-line no-unused-vars
  calcular(pesoGramas, tempoHoras, precoPorGrama) {
    throw new Error('Método não implementado');
  }
}

module.exports = PrecoStrategy;
