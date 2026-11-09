const Cliente = require('../../domain/entities/Cliente');
const {
  NaoEncontradoError,
  RegraDeNegocioError,
} = require('../../utils/errors');

class ClienteService {
  constructor(clienteRepository) {
    if (!clienteRepository) {
      throw new Error('clienteRepository deve ser fornecido no construtor.');
    }
    this.clienteRepository = clienteRepository;
  }

  async criar(dados) {
    let novoCliente;
    try {
      novoCliente = new Cliente(dados);
    } catch (error) {
      throw new RegraDeNegocioError(error.message);
    }

    const clienteExistente = await this.clienteRepository.buscarPorEmail(
      novoCliente.email,
    );
    if (clienteExistente) {
      throw new RegraDeNegocioError(
        'Já existe um cliente cadastrado com este e-mail.',
      );
    }

    return await this.clienteRepository.criar(novoCliente);
  }

  async listar() {
    return await this.clienteRepository.listar();
  }

  async buscarPorId(id) {
    const cliente = await this.clienteRepository.buscarPorId(id);
    if (!cliente) {
      throw new NaoEncontradoError('Cliente não encontrado.');
    }
    return cliente;
  }

  async atualizar(id, dados) {
    const clienteExistente = await this.clienteRepository.buscarPorId(id);
    if (!clienteExistente) {
      throw new NaoEncontradoError('Cliente não encontrado.');
    }

    const novoNome =
      dados.nome !== undefined ? dados.nome : clienteExistente.nome;
    const novoEmail =
      dados.email !== undefined ? dados.email : clienteExistente.email;
    const novoTipo =
      dados.tipo !== undefined ? dados.tipo : clienteExistente.tipo;

    let clienteValidado;
    try {
      clienteValidado = new Cliente({
        id: clienteExistente.id,
        nome: novoNome,
        email: novoEmail,
        tipo: novoTipo,
      });
    } catch (error) {
      throw new RegraDeNegocioError(error.message);
    }

    if (clienteValidado.email !== clienteExistente.email) {
      const clienteComEmail = await this.clienteRepository.buscarPorEmail(
        clienteValidado.email,
      );
      if (clienteComEmail && Number(clienteComEmail.id) !== Number(id)) {
        throw new RegraDeNegocioError(
          'Já existe um cliente cadastrado com este e-mail.',
        );
      }
    }

    return await this.clienteRepository.atualizar(id, {
      nome: clienteValidado.nome,
      email: clienteValidado.email,
      tipo: clienteValidado.tipo,
    });
  }

  async deletar(id) {
    const clienteExistente = await this.clienteRepository.buscarPorId(id);
    if (!clienteExistente) {
      throw new NaoEncontradoError('Cliente não encontrado.');
    }

    await this.clienteRepository.deletar(id);
    return { mensagem: 'Cliente removido com sucesso.' };
  }
}

module.exports = ClienteService;

