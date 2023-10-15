import { DataSource } from "typeorm";
import { Criptomoeda } from "./entities/criptomoeda.entity";

require('dotenv').config();

const FonteDeDados = new DataSource({
    type: "mysql",
    host: process.env.BD_HOST,
    port: Number(process.env.BD_PORT),
    username: process.env.BD_USERNAME,
    password: process.env.BD_PASSWORD,
    database: process.env.BD_DATABASE,
    synchronize: true,
    logging: false,
    entities: [Criptomoeda],
    subscribers: [],
    migrations: [],
})

export const BancoDeDados = FonteDeDados.initialize().then((f) => { return f.manager; });
