const agentesRepository = require('../repositories/agentesRepository');
const { agenteSchema, formatZodError } = require('../utils/agentesValidation');
const { ZodError } = require('zod');

class ApiError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
    }
}
const getAgentes = async (req, res, next) => {
    try {
        const { cargo, sort, dataDeIncorporacao } = req.query;

        // Construindo o filtro
        const filter = {};
        if (cargo) filter.cargo = cargo;
        if (dataDeIncorporacao) filter.dataDeIncorporacao = dataDeIncorporacao;

        // Configuração de ordenação
        const orderByMapping = {
            dataDeIncorporacao: ['dataDeIncorporacao', 'asc'],
            '-dataDeIncorporacao': ['dataDeIncorporacao', 'desc'],
        };

        // Ordenação padrão se não for especificada
        let orderBy = sort ? orderByMapping[sort] : ['id', 'asc'];

        // Validação da ordenação apenas se foi especificada
        if (sort && !orderByMapping[sort]) {
            return res.status(400).json({ 
                message: 'Ordenação permitida apenas por dataDeIncorporacao ou -dataDeIncorporacao'
            });
        }

        const agentes = await agentesRepository.findAll(filter, orderBy);

        // Mensagem específica dependendo dos filtros usados
        if (!agentes || agentes.length === 0) {
            if (cargo || dataDeIncorporacao) {
                throw new ApiError('Nenhum agente encontrado com os filtros fornecidos', 404);
            }
            throw new ApiError('Nenhum agente encontrado', 404);
        }

        res.status(200).json(agentes);
    } catch (error) {
        console.error('Erro ao buscar agentes:', error);
        next(new ApiError('Erro ao buscar agentes', 500));
    }
};


const getAgenteById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const idNum = Number(id);
        if (!Number.isInteger(idNum)) {
            throw new ApiError('O parâmetro id deve ser um número inteiro', 400);
        }
        const agente = await agentesRepository.findById(idNum);
        if (!agente) {
            throw new ApiError('Agente não encontrado', 404);
        }
        res.status(200).json(agente);
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError('Erro ao buscar agente', 500));
    }
};

const createAgente = async (req, res, next) => {
    try {
        const { nome, dataDeIncorporacao, cargo } = req.body;

        const dadosRecebidos = {
            nome,
            dataDeIncorporacao: dataDeIncorporacao,
            cargo
        };

        const data = agenteSchema.parse(dadosRecebidos);
        const novoAgente = await agentesRepository.create(data);
        res.status(201).json(novoAgente);
    } catch (error) {
        if (error instanceof ZodError) {
            const formattedError = formatZodError(error);
            return res.status(400).json(formattedError);
        }
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError('Erro ao criar agente', 500));
    }
};
const updateAgente = async (req, res, next) => {
    const { id } = req.params;
    try {
        // Rejeitar se payload contém id
        if ('id' in req.body) {
            return res.status(400).json({ message: 'Não é permitido alterar o campo id' });
        }

        const { nome, dataDeIncorporacao, cargo } = req.body;
        
        const dadosRecebidos = {
            nome,
            dataDeIncorporacao: dataDeIncorporacao,
            cargo
        };
        const data = agenteSchema.parse(dadosRecebidos);
        const agenteAtualizado = await agentesRepository.update(id, data);

        if (!agenteAtualizado) {
            throw new ApiError('Agente não encontrado', 404);
        }
         res.status(200).json({
            message: 'Agente atualizado com sucesso',
            data: agenteAtualizado
        });
    } catch (error) {
        if (error instanceof ZodError) {
            const formattedError = formatZodError(error);
            return res.status(400).json(formattedError);
        }
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError('Erro ao atualizar agente', 500));
    }
};

const partialUpdateAgente = async (req, res, next) => {
    const { id } = req.params;
    try {
        // Rejeitar se payload contém id
        if ('id' in req.body) {
            return res.status(400).json({ message: 'Não é permitido alterar o campo id' });
        }

        const { nome, dataDeIncorporacao, cargo } = req.body;

        const dadosRecebidos = {};
        if (nome !== undefined) dadosRecebidos.nome = nome;
        if (dataDeIncorporacao !== undefined) dadosRecebidos.dataDeIncorporacao = dataDeIncorporacao;
        if (cargo !== undefined) dadosRecebidos.cargo = cargo;

        const data = agenteSchema.partial().parse(dadosRecebidos);

        const agenteAtualizado = await agentesRepository.update(id, data);

        if (!agenteAtualizado) {
            return next(new ApiError('Agente não encontrado', 404));
        }

        res.status(200).json({
            message: 'Agente atualizado com sucesso',
            data: agenteAtualizado
        });

    } catch (error) {
        if (error instanceof ZodError) {
            const formattedError = formatZodError(error);
            return res.status(400).json(formattedError);
        }
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError('Erro ao atualizar agente', 500));
    }
};

const deleteAgente = async (req, res, next) => {
    const { id } = req.params;
    try {
        const agenteDeletado = await agentesRepository.remove(id);
        if (!agenteDeletado) {
            throw new ApiError('Agente não encontrado', 404);
        }
        res.status(204).send();

    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError('Erro ao deletar agente', 500));
    }
};

module.exports = {
    getAgentes,
    getAgenteById,
    createAgente,
    updateAgente,
    partialUpdateAgente,
    deleteAgente
};