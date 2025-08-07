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
    const [casoRemovido] = await knex('casos').where({ id }).del().returning('*');
    return casoRemovido;
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};