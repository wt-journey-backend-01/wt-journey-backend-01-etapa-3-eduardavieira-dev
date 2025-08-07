const knex = require('../db/db');

const findAll = () => {
    return knex('agentes').select('*');
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
    const [deletedAgente] = await knex('agentes').where({ id }).del().returning('*');
    return deletedAgente;
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};