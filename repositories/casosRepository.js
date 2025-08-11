const knex = require('../db/db');

const findAll = (filters = {}) => {
    let query = knex('casos');

    if (filters.agente_id) {
        const agenteId = Number(filters.agente_id);
        if (!Number.isInteger(agenteId)) {
            throw new Error('O parâmetro agente_id deve ser um número inteiro');
        }
        query = query.where('agente_id', agenteId);
    }

    if (filters.status) {
        if (!['aberto', 'solucionado'].includes(filters.status)) {
            throw new Error('Status inválido. Use "aberto" ou "solucionado"');
        }
        query = query.where('status', filters.status);
    }

    return query.select('*')
        .orderBy('id', 'desc'); // Ordenação padrão por id decrescente
}

async function filter(term) {
    const result = await knex('casos')
        .select('*')
        .where('titulo', 'ilike', `%${term}%`)
        .orWhere('descricao', 'ilike', `%${term}%`);

    // console.log(result);
    return result;
}

const findById = (id) => {
    return knex('casos').where({ id }).first();
}

const create = async (data) => {
    const novoCaso = {
        ...data
    };
    const [casoCriado] = await knex('casos').insert(novoCaso).returning('*');
    return casoCriado;
}

const update = async (id, data) => {
    const [updated] = await knex('casos').where({ id }).update(data).returning('*');

    return updated;
};

const remove = async (id) => {
    const caso = await knex('casos').where({id}).first();
    if(!caso) return null;

    await knex('casos').where({ id }).del();
    return caso;
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove,
    filter
};