const IMaterialRepository = require('../../domain/repositories/IMaterialRepository');
const Material = require('../../domain/entities/Material');

class MaterialRepositoryPrisma extends IMaterialRepository {
  constructor(prismaClient) {
    super();
    if (!prismaClient) {
      throw new Error('PrismaClient deve ser fornecido no construtor.');
    }
    this.prisma = prismaClient;
  }

  async criar(material) {
    const registro = await this.prisma.material.create({
      data: {
        nome: material.nome,
        tipo: material.tipo,
        precoPorGrama: material.precoPorGrama,
        estoqueGramas: material.estoqueGramas,
      },
    });

    return this._paraEntidade(registro);
  }

  async buscarPorId(id) {
    const registro = await this.prisma.material.findUnique({
      where: { id: Number(id) },
    });

    return this._paraEntidade(registro);
  }

  async listar() {
    const registros = await this.prisma.material.findMany();
    return registros.map((registro) => this._paraEntidade(registro));
  }

  async atualizar(id, dados) {
    const data = {};
    if (dados.nome !== undefined) data.nome = dados.nome;
    if (dados.tipo !== undefined) data.tipo = dados.tipo;
    if (dados.precoPorGrama !== undefined) {
      data.precoPorGrama = dados.precoPorGrama;
    }
    if (dados.estoqueGramas !== undefined) {
      data.estoqueGramas = dados.estoqueGramas;
    }

    const registro = await this.prisma.material.update({
      where: { id: Number(id) },
      data,
    });

    return this._paraEntidade(registro);
  }

  async deletar(id) {
    await this.prisma.material.delete({
      where: { id: Number(id) },
    });
    return true;
  }

  _paraEntidade(registro) {
    if (!registro) return null;
    return new Material({
      id: registro.id,
      nome: registro.nome,
      tipo: registro.tipo,
      precoPorGrama: registro.precoPorGrama,
      estoqueGramas: registro.estoqueGramas,
    });
  }
}

module.exports = MaterialRepositoryPrisma;
