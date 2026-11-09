class ClienteController {
  constructor(clienteService) {
    if (!clienteService) {
      throw new Error('clienteService deve ser fornecido no construtor.');
    }
    this.clienteService = clienteService;

    this.criar = this.criar.bind(this);
    this.listar = this.listar.bind(this);
    this.buscarPorId = this.buscarPorId.bind(this);
    this.atualizar = this.atualizar.bind(this);
    this.deletar = this.deletar.bind(this);
  }

  async criar(req, res, next) {
    try {
      const cliente = await this.clienteService.criar(req.body);
      return res.status(201).json(cliente);
    } catch (error) {
      return next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const clientes = await this.clienteService.listar();
      return res.status(200).json(clientes);
    } catch (error) {
      return next(error);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const cliente = await this.clienteService.buscarPorId(req.params.id);
      return res.status(200).json(cliente);
    } catch (error) {
      return next(error);
    }
  }

  async atualizar(req, res, next) {
    try {
      const cliente = await this.clienteService.atualizar(
        req.params.id,
        req.body,
      );
      return res.status(200).json(cliente);
    } catch (error) {
      return next(error);
    }
  }

  async deletar(req, res, next) {
    try {
      const resultado = await this.clienteService.deletar(req.params.id);
      return res.status(200).json(resultado);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = ClienteController;

