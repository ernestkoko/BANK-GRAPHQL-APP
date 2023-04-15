
export const config = () => ({
  database: {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: ['dist/src/**/entities/*.entity{.ts,.js}'],
    synchronize: process.env.DATABASE_TYPEORM_SYNC,
    autoLoadEntities: true,
    migrations: ['dist/src/db/migrations/*.js'],
    migrationsTableName: 'custom_migration_table',
    cli: {
      migrationsDir: 'src/db/migrations',
    },
    seeds: ['src/seeds/**/*{.ts,.js}'],
    factories: ['src/factories/**/*{.ts,.js}'],
  },
});
