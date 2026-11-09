/* eslint-disable no-unused-vars */
class IClienteRepository {
  async criar(cliente) {
    throw new Error('Método não implementado');
  }

  async buscarPorId(id) {
    throw new Error('Método não implementado');
  }

  async buscarPorEmail(email) {
    throw new Error('Método não implementado');
  }

  async listar() {
    throw new Error('Método não implementado');
  }

  async atualizar(id, dados) {
    throw new Error('Método não implementado');
  }

  async deletar(id) {
    throw new Error('Método não implementado');
  }
}

module.exports = IClienteRepository;

