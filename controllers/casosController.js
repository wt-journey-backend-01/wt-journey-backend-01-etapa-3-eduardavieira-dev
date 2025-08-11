const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');
const { casoSchema, formatZodError } = require('../utils/casosValidation');
const { ZodError } = require('zod');

class ApiError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
    }
}

const getCasos = async (req, res, next) => {
  try {
    const { agente_id, status, q } = req.query;
    
    // Validate agente_id if provided
    if (agente_id) {
      const idNum = Number(agente_id);
      if (!Number.isInteger(idNum)) {
        throw new ApiError('O parâmetro agente_id deve ser um número inteiro', 400);
      }
    }

    // Validate status if provided
    if (status && !['aberto', 'solucionado'].includes(status)) {
      throw new ApiError('Status inválido. Use "aberto" ou "solucionado"', 400);
    }

    const filtros = { agente_id, status, q };

    const casos = await casosRepository.findAll(filtros);

    if (casos.length === 0) {
      if (agente_id || status || q) {
        throw new ApiError(`Nenhum caso encontrado com os filtros fornecidos.`, 404);
      } else {
        throw new ApiError(`Nenhum caso encontrado.`, 404);
      }
    }

    res.status(200).json(casos);
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    next(new ApiError('Erro ao buscar casos', 500));
  }
};


const getCasoById = async (req, res, next) => {
    const { id } = req.params;
    try {
        // Verifica se o id é um número inteiro válido
        const casoId = Number(id);
        if (!Number.isInteger(casoId)) {
            return res.status(400).json({ message: 'O parâmetro id deve ser um número inteiro.' });
        }

        const caso = await casosRepository.findById(casoId);
        if (!caso) {
            throw new ApiError('Caso não encontrado', 404);
        }
        res.status(200).json(caso);
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError('Erro ao buscar caso', 500));
    }
};

const createCaso = async (req, res, next) => {
    try {
        const { titulo, descricao, status, agente_id } = req.body;

        const dadosRecebidos = {
            titulo,
            descricao,
            status: status || 'aberto',
            agente_id
        };

        // Validar primeiro com Zod
        const data = casoSchema.parse(dadosRecebidos);
        
        const agenteExiste = await agentesRepository.findById(data.agente_id);
        if (!agenteExiste) {
            throw new ApiError('Agente não encontrado. Verifique se o agente_id é válido.', 404);
        }

        const novoCaso = await casosRepository.create(data);
        res.status(201).json(novoCaso);
    } catch (error) {
        if (error instanceof ZodError) {
            const formattedError = formatZodError(error);
            return res.status(400).json(formattedError);
        }
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError('Erro ao criar caso', 500));
    }
};
const updateCaso = async (req, res, next) => {
    const { id } = req.params;
    try {
        // Rejeitar se payload contém id
        if ('id' in req.body) {
            return res.status(400).json({ message: 'Não é permitido alterar o campo id' });
        }

        const { titulo, descricao, status, agente_id } = req.body;

        const dadosRecebidos = {
            titulo,
            descricao,
            status,
            agente_id
        };

        // Validar primeiro com Zod
        const data = casoSchema.parse(dadosRecebidos);
        
        // Verificar se o agente existe se agente_id foi fornecido
        const agenteExiste = await agentesRepository.findById(data.agente_id);
        if (!agenteExiste) {
            throw new ApiError('Agente não encontrado. Verifique se o agente_id é válido.', 404);
        }

        const casoAtualizado = await casosRepository.update(id, data);

        if (!casoAtualizado) {
            throw new ApiError('Caso não encontrado', 404);
        }
        res.status(200).json({
            message: 'Caso atualizado com sucesso',
            data: casoAtualizado
        });
    } catch (error) {
        if (error instanceof ZodError) {
            const formattedError = formatZodError(error);
            return res.status(400).json(formattedError);
        }
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError('Erro ao atualizar caso', 500));
    }
};

const partialUpdateCaso = async (req, res, next) => {
    const { id } = req.params;
    try {
        // Rejeitar se payload contém id
        if ('id' in req.body) {
            return res.status(400).json({ message: 'Não é permitido alterar o campo id' });
        }

        const { titulo, descricao, status, agente_id } = req.body;

        const dadosRecebidos = {};
        if (titulo !== undefined) dadosRecebidos.titulo = titulo;
        if (descricao !== undefined) dadosRecebidos.descricao = descricao;
        if (status !== undefined) dadosRecebidos.status = status;
        if (agente_id !== undefined) dadosRecebidos.agente_id = agente_id;

        // Validar primeiro com Zod
        const data = casoSchema.partial().parse(dadosRecebidos);

        // Verificar se o agente existe se agente_id foi fornecido
        if (agente_id !== undefined) {
            const agenteExiste = await agentesRepository.findById(agente_id);
            if (!agenteExiste) {
                throw new ApiError('Agente não encontrado. Verifique se o agente_id é válido.', 404);
            }
        }

        const casoAtualizado = await casosRepository.update(id, data);

        if (!casoAtualizado) {
            return next(new ApiError('Caso não encontrado', 404));
        }

        res.status(200).json({
            message: 'Caso atualizado com sucesso',
            data: casoAtualizado
        });

    } catch (error) {
        if (error instanceof ZodError) {
            const formattedError = formatZodError(error);
            return res.status(400).json(formattedError);
        }
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError('Erro ao atualizar caso', 500));
    }
};


const deleteCaso = async (req, res, next) => {
    const { id } = req.params;
    try {
        const casoDeletado = await casosRepository.remove(id);
        if (!casoDeletado) {
            throw new ApiError('Caso não encontrado', 404);
        }
        res.status(204).send();
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError('Erro ao deletar caso', 500));
    }
};

const getAgenteDoCaso = async (req, res, next) => {
    const { id } = req.params;
    try {
        const caso = await casosRepository.findById(id);
        if (!caso) {
            throw new ApiError(`Caso com ID ${id} não encontrado`, 404);
        }

        const agente = await agentesRepository.findById(caso.agente_id);
        if (!agente) {
            throw new ApiError(`Agente com ID ${caso.agente_id} não encontrado para o caso ${id}`, 404);
        }
        
        res.status(200).json(agente);
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError('Erro ao buscar agente do caso', 500));
    }
};

module.exports = {
    getCasos,
    getCasoById,
    createCaso,
    updateCaso,
    partialUpdateCaso,
    deleteCaso,
    getAgenteDoCaso
};