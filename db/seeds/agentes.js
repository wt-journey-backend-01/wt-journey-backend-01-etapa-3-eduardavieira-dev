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
      id: 1, // Definindo ID específico para referência
      nome: 'João Gonçalves',
      dataDeIncorporacao: '2020-01-15',
      cargo: 'investigador'
    },
    {
      id: 2, // Definindo ID específico para referência
      nome: 'Ana Pereira',
      dataDeIncorporacao: '2018-06-20',
      cargo: 'delegada'
    },
  ]);
  
  // Reinicia a sequência do ID para continuar a partir do próximo número
  await knex.raw("SELECT setval(pg_get_serial_sequence('agentes', 'id'), coalesce(max(id),0) + 1, false) FROM agentes");
  
  console.log('✅ Agentes inseridos com sucesso!');

};