const StatusPedido = require('./StatusPedido');
const OrcamentoState = require('../states/OrcamentoState');

class Pedido {
  constructor({
    id = null,
    clienteId,
    materialId,
    descricao,
    pesoGramas,
    tempoHoras,
    valorTotal,
    criadoEm = new Date(),
  } = {}) {
    this.id = id;
    this.clienteId = clienteId;
    this.materialId = materialId;
    this.descricao = descricao;
    this.pesoGramas = pesoGramas;
    this.tempoHoras = tempoHoras;
    this.valorTotal = valorTotal;
    this.criadoEm = criadoEm;
    this.estado = new OrcamentoState();
  }

  get status() {
    return this.estado.nome();
  }

  definirEstado(estado) {
    this.estado = estado;
  }

  aprovar() {
    this.estado.aprovar(this);
  }

  iniciarImpressao() {
    this.estado.iniciarImpressao(this);
  }

  concluir() {
    this.estado.concluir(this);
  }

  entregar() {
    this.estado.entregar(this);
  }

  cancelar() {
    this.estado.cancelar(this);
  }

  podeSerExcluido() {
    return this.status === StatusPedido.ORCAMENTO;
  }
}

module.exports = Pedido;
