const knex = require('../db/db');

const findAll = async (filters = {}) => {
        let query = knex('agentes');

    if (filters.cargo) {
        query = query.whereRaw('LOWER(cargo) = ?', filters.cargo.toLowerCase());
    }

    if (filters.sort) {
        const direction = filters.sort.startsWith('-') ? 'desc' : 'asc';
        const column = filters.sort.replace('-', '');
        query = query.orderBy(column, direction);
    }

    return await query.select('*');
}

const findById = (id) => {
    return knex('agentes').where({ id }).first();
}

const create = async (data) => {
    const novoAgente = {
        ...data
    };
    const [agenteCriado] = await knex('agentes').insert(novoAgente).returning('*');
    
    return agenteCriado;
}

const update = async (id, data) => {
    const [agenteAtualizado] = await knex('agentes').where({ id }).update(data).returning('*');
    
    return agenteAtualizado;
};

const remove = async (id) => {
      const agente = await knex('agentes').where({ id }).first();

        if (!agente) return null;

        await knex('agentes').where({ id }).del();

        return agente;
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};