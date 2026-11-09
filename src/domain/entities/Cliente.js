const TipoCliente = require('./TipoCliente');

class Cliente {
  constructor(dadosOuId, nome, email, tipo) {
    let dados = {};

    if (typeof dadosOuId === 'object' && dadosOuId !== null) {
      dados = dadosOuId;
    } else if (typeof dadosOuId === 'number' || dadosOuId === null) {
      dados = { id: dadosOuId, nome, email, tipo };
    } else if (typeof dadosOuId === 'string') {
      dados = { nome: dadosOuId, email: nome, tipo: email, id: tipo ?? null };
    }

    this._validar(dados);

    this.id = dados.id ?? null;
    this.nome = dados.nome.trim();
    this.email = dados.email.trim().toLowerCase();
    this.tipo = dados.tipo;
  }

  _validar({ nome, email, tipo }) {
    if (!nome || typeof nome !== 'string' || nome.trim().length < 2) {
      throw new Error(
        'O nome é obrigatório e deve ter no mínimo 2 caracteres.',
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      throw new Error('O e-mail informado é inválido.');
    }

    const tiposValidos = Object.values(TipoCliente);
    if (!tipo || !tiposValidos.includes(tipo)) {
      throw new Error(
        `Tipo de cliente inválido. Deve ser um dos seguintes: ${tiposValidos.join(', ')}.`,
      );
    }
  }
}

module.exports = Cliente;
