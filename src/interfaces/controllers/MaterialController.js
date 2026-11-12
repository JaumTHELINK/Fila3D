class MaterialController {
  constructor(materialService) {
    if (!materialService) {
      throw new Error('materialService deve ser fornecido no construtor.');
    }
    this.materialService = materialService;

    this.criar = this.criar.bind(this);
    this.listar = this.listar.bind(this);
    this.buscarPorId = this.buscarPorId.bind(this);
    this.atualizar = this.atualizar.bind(this);
    this.abaterEstoque = this.abaterEstoque.bind(this);
    this.reporEstoque = this.reporEstoque.bind(this);
    this.deletar = this.deletar.bind(this);
  }

  async criar(req, res, next) {
    try {
      const material = await this.materialService.criar(req.body);
      return res.status(201).json(material);
    } catch (error) {
      return next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const materiais = await this.materialService.listar();
      return res.status(200).json(materiais);
    } catch (error) {
      return next(error);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const material = await this.materialService.buscarPorId(req.params.id);
      return res.status(200).json(material);
    } catch (error) {
      return next(error);
    }
  }

  async atualizar(req, res, next) {
    try {
      const material = await this.materialService.atualizar(
        req.params.id,
        req.body,
      );
      return res.status(200).json(material);
    } catch (error) {
      return next(error);
    }
  }

  async abaterEstoque(req, res, next) {
    try {
      const material = await this.materialService.abaterEstoque(
        req.params.id,
        req.body.gramas,
      );
      return res.status(200).json(material);
    } catch (error) {
      return next(error);
    }
  }

  async reporEstoque(req, res, next) {
    try {
      const material = await this.materialService.reporEstoque(
        req.params.id,
        req.body.gramas,
      );
      return res.status(200).json(material);
    } catch (error) {
      return next(error);
    }
  }

  async deletar(req, res, next) {
    try {
      const resultado = await this.materialService.deletar(req.params.id);
      return res.status(200).json(resultado);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = MaterialController;
