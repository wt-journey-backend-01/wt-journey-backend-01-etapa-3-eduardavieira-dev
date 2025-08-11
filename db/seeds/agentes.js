/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Limpa as tabelas antes de inserir dados novos
  await knex('agentes').del();

  // Insere agentes
  await knex('agentes').insert([
    {
      nome: 'João Gonçalves',
      dataDeIncorporacao: '2020-01-15',
      cargo: 'investigador'
    },
    {
      nome: 'Ana Pereira',
      dataDeIncorporacao: '2018-06-20',
      cargo: 'delegada'
    },
  ]);

};