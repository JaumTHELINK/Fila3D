const Material = require('../../domain/entities/Material');
const {
  NaoEncontradoError,
  RegraDeNegocioError,
} = require('../../utils/errors');

class MaterialService {
  constructor(materialRepository) {
    if (!materialRepository) {
      throw new Error('materialRepository deve ser fornecido no construtor.');
    }
    this.materialRepository = materialRepository;
  }

  async criar(dados) {
    const material = this._criarEntidade(dados);
    return this.materialRepository.criar(material);
  }

  async listar() {
    return this.materialRepository.listar();
  }

  async buscarPorId(id) {
    const material = await this.materialRepository.buscarPorId(id);
    if (!material) {
      throw new NaoEncontradoError('Material não encontrado.');
    }
    return material;
  }

  async atualizar(id, dados) {
    const materialExistente = await this.buscarPorId(id);
    const materialAtualizado = this._criarEntidade({
      id: materialExistente.id,
      nome: dados.nome ?? materialExistente.nome,
      tipo: dados.tipo ?? materialExistente.tipo,
      precoPorGrama: dados.precoPorGrama ?? materialExistente.precoPorGrama,
      estoqueGramas: dados.estoqueGramas ?? materialExistente.estoqueGramas,
    });

    return this.materialRepository.atualizar(id, {
      nome: materialAtualizado.nome,
      tipo: materialAtualizado.tipo,
      precoPorGrama: materialAtualizado.precoPorGrama,
      estoqueGramas: materialAtualizado.estoqueGramas,
    });
  }

  async abaterEstoque(id, gramas) {
    const material = await this.buscarPorId(id);
    this._validarEstoque(() => material.abaterEstoque(gramas));

    const materialAtualizado = await this.materialRepository.abaterEstoque(
      id,
      gramas,
    );
    if (materialAtualizado) return materialAtualizado;

    await this.buscarPorId(id);
    throw new RegraDeNegocioError('Estoque insuficiente para essa quantidade.');
  }

  async reporEstoque(id, gramas) {
    const material = await this.buscarPorId(id);
    this._validarEstoque(() => material.reporEstoque(gramas));

    return this.materialRepository.reporEstoque(id, gramas);
  }

  async deletar(id) {
    await this.buscarPorId(id);
    await this.materialRepository.deletar(id);
    return { mensagem: 'Material removido com sucesso.' };
  }

  _criarEntidade(dados) {
    try {
      return new Material(dados);
    } catch (error) {
      throw new RegraDeNegocioError(error.message);
    }
  }

  _validarEstoque(operacao) {
    try {
      operacao();
    } catch (error) {
      throw new RegraDeNegocioError(error.message);
    }
  }
}

module.exports = MaterialService;
