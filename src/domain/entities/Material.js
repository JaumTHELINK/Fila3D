const TipoMaterial = require('./TipoMaterial');

class Material {
  constructor(dados) {
    this._validar(dados);

    this.id = dados.id ?? null;
    this.nome = dados.nome.trim();
    this.tipo = dados.tipo;
    this.precoPorGrama = dados.precoPorGrama;
    this.estoqueGramas = dados.estoqueGramas;
  }

  _validar({ id, nome, tipo, precoPorGrama, estoqueGramas } = {}) {
    if (id !== undefined && id !== null && (!Number.isInteger(id) || id <= 0)) {
      throw new Error('O id do material deve ser um inteiro positivo.');
    }

    if (!nome || typeof nome !== 'string' || nome.trim().length < 2) {
      throw new Error(
        'O nome é obrigatório e deve ter no mínimo 2 caracteres.',
      );
    }

    const tiposValidos = Object.values(TipoMaterial);
    if (!tiposValidos.includes(tipo)) {
      throw new Error(
        `Tipo de material inválido. Deve ser um dos seguintes: ${tiposValidos.join(', ')}.`,
      );
    }

    if (
      typeof precoPorGrama !== 'number' ||
      !Number.isFinite(precoPorGrama) ||
      precoPorGrama <= 0
    ) {
      throw new Error('O preço por grama deve ser um número maior que zero.');
    }

    if (
      typeof estoqueGramas !== 'number' ||
      !Number.isFinite(estoqueGramas) ||
      estoqueGramas < 0
    ) {
      throw new Error('O estoque em gramas deve ser um número não negativo.');
    }
  }

  temEstoque(gramas) {
    this._validarQuantidade(gramas);
    return this.estoqueGramas >= gramas;
  }

  abaterEstoque(gramas) {
    this._validarQuantidade(gramas);
    if (!this.temEstoque(gramas)) {
      throw new Error('Estoque insuficiente para essa quantidade.');
    }
    this.estoqueGramas -= gramas;
    return this.estoqueGramas;
  }

  reporEstoque(gramas) {
    this._validarQuantidade(gramas);
    this.estoqueGramas += gramas;
    return this.estoqueGramas;
  }

  _validarQuantidade(gramas) {
    if (typeof gramas !== 'number' || !Number.isFinite(gramas) || gramas <= 0) {
      throw new Error(
        'A quantidade em gramas deve ser um número maior que zero.',
      );
    }
  }
}

module.exports = Material;
