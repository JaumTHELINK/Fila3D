const IClienteRepository = require('../../domain/repositories/IClienteRepository');
const Cliente = require('../../domain/entities/Cliente');

class ClienteRepositoryPrisma extends IClienteRepository {
  constructor(prismaClient) {
    super();
    if (!prismaClient) {
      throw new Error('PrismaClient deve ser fornecido no construtor.');
    }
    this.prisma = prismaClient;
  }

  async criar(cliente) {
    const registro = await this.prisma.cliente.create({
      data: {
        nome: cliente.nome,
        email: cliente.email,
        tipo: cliente.tipo,
      },
    });

    return this._paraEntidade(registro);
  }

  async buscarPorId(id) {
    const registro = await this.prisma.cliente.findUnique({
      where: { id: Number(id) },
    });

    if (!registro) {
      return null;
    }

    return this._paraEntidade(registro);
  }

  async buscarPorEmail(email) {
    if (!email) return null;

    const registro = await this.prisma.cliente.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!registro) {
      return null;
    }

    return this._paraEntidade(registro);
  }

  async listar() {
    const registros = await this.prisma.cliente.findMany();
    return registros.map((registro) => this._paraEntidade(registro));
  }

  async atualizar(id, dados) {
    const data = {};
    if (dados.nome !== undefined) data.nome = dados.nome;
    if (dados.email !== undefined) data.email = dados.email;
    if (dados.tipo !== undefined) data.tipo = dados.tipo;

    const registro = await this.prisma.cliente.update({
      where: { id: Number(id) },
      data,
    });

    return this._paraEntidade(registro);
  }

  async deletar(id) {
    await this.prisma.cliente.delete({
      where: { id: Number(id) },
    });
    return true;
  }

  _paraEntidade(registro) {
    if (!registro) return null;
    return new Cliente({
      id: registro.id,
      nome: registro.nome,
      email: registro.email,
      tipo: registro.tipo,
    });
  }
}

module.exports = ClienteRepositoryPrisma;

