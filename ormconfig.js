const path = require('path');
const baseConfig = {
  synchronize: false,
  migrations: ['src/migrations/*.{ts,js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

let envConfig;

switch (process.env.NODE_ENV) {
  case 'development':
  case 'dev':
    envConfig = {
      type: 'sqlite',
      database: path.resolve(__dirname, 'db.sqlite'),
      entities: ['src/**/*.entity.ts'],
      migrations: ['src/migrations/*.ts'],
    };
    break;
  case 'test':
    envConfig = {
      type: 'sqlite',
      database: path.resolve(__dirname, 'test.sqlite'),
      entities: ['src/**/*.entity.ts'],
      migrations: ['src/migrations/*.ts'],
      dropSchema: true,
    };
    break;
  case 'production':
    envConfig = {
      type: 'sqlite',
      database: path.resolve(__dirname, 'prod.sqlite'),
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/migrations/*.js'],
    };
    break;
  default:
    throw new Error('Unknown Environment: ' + process.env.NODE_ENV);
}

module.exports = Object.assign({}, baseConfig, envConfig);
