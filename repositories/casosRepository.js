const knex = require('../db/db');

const findAll = (filters = {}) => {
    let query = knex('casos');

    if (filters.agente_id) {
        query = query.where('agente_id', filters.agente_id);
    }

    if (filters.status) {
        query = query.where('status', filters.status);
    }

    if (filters.q) {
        query = query.where(function() {
            this.where('titulo', 'ilike', `%${filters.q}%`)
                .orWhere('descricao', 'ilike', `%${filters.q}%`);
        });
    }

    return query.select('*');
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
    remove
};