/* eslint-disable no-unused-vars */
class IMaterialRepository {
  async criar(material) {
    throw new Error('Método não implementado');
  }

  async buscarPorId(id) {
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

module.exports = IMaterialRepository;
