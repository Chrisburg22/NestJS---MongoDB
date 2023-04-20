import { Module, Global } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongoClient } from 'mongodb';

import config from '../config';
import { MongooseModule } from '@nestjs/mongoose';
const API_KEY = '12345634';
const API_KEY_PROD = 'PROD1212121SA';


@Global()
@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://mondodb-exhio.wxo8gfl.mongodb.net', {
      user: 'christianadmin',
      pass: 'chA4vBV0qoYri5T2',
      dbName: 'platzi-store',
    }),
  ],
  providers: [
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    },
     {
       provide: 'MONGO',
       useFactory: async (configService: ConfigType<typeof config>) => {
         const {connection,user,password,host,dbName} = configService.mongo; //Get mongo config.
         //Utilizo una base de datos creada en mongo atlas.
         //const uri = 'christianadmin:chA4vBV0qoYri5T2@mondodb-exhio.wxo8gfl.mongodb.net/?retryWrites=true&w=majority';
         const uri = `${connection}://${user}:${password}@${host}/retryWrites=true&w=majority?`
         const client = new MongoClient(uri); //Creamos un Objeto de tipo MongoClient
         await client.connect(); //Hacemos la conexión con el cluster
         const database = client.db(dbName); //Conexión a la base de datos de platzi-store
         return database;
       },
       inject: [config.KEY],
     },
  ],
  exports: ['API_KEY', 'MONGO', MongooseModule],
})
export class DatabaseModule {}
