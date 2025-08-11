/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

require('dotenv').config();

// console.log('🔍 Variáveis de ambiente carregadas:');
// console.log({
//   POSTGRES_USER: process.env.POSTGRES_USER,
//   POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
//   POSTGRES_DB: process.env.POSTGRES_DB,
// });

console.log('🔍 Variáveis carregadas do .env:', {
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  db: process.env.POSTGRES_DB,
});

module.exports = {

  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    },
    migrations: {
        directory: './db/migrations',
      },
    seeds: {
        directory: './db/seeds',
      },
  },
  ci: {
    client: 'pg',
    connection: {
      host: 'postgres', 
      port: 5432,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  }

};
