const knex = require('../db/db');

const findAll = async (filter = {}, orderBy = ['id', 'asc']) => {
     const result = await db('agentes')
            .select('*')
            .where(filter)
            .orderBy(orderBy[0], orderBy[1]);
    return await result.map((agente) => ({
            ...agente,
            dataDeIncorporacao: new Date(agente.dataDeIncorporacao).toISOString().split('T')[0],
        }));
}

const findById = async (id) => {
    return await knex('agentes').where({ id }).first();
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