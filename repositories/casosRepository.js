const knex = require('../db/db');

const findAll = () => {
    return knex('casos').select('*');
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
    const caso = await knex('caso').where({id}).first();
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