// Padrão Repository (GRASP: Protected Variations + Low Coupling).
// Esta interface é o contrato que o service conhece; a regra de negócio não
// depende de Prisma nem de SQL. Trocar o banco não altera os services.
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

  async abaterEstoque(id, gramas) {
    throw new Error('Método não implementado');
  }

  async reporEstoque(id, gramas) {
    throw new Error('Método não implementado');
  }

  async deletar(id) {
    throw new Error('Método não implementado');
  }
}

module.exports = IMaterialRepository;
