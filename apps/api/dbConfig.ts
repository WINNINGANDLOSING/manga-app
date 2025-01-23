import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const pgConfig: PostgresConnectionOptions = {
  url: 'postgresql://neondb_owner:imFEHVues39r@ep-twilight-river-a5olxiul.us-east-2.aws.neon.tech/neondb?sslmode=require',
  type: 'postgres',
  port: 3306,
  entities: [],
  synchronize:true,
};
