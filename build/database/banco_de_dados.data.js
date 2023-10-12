"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BancoDeDados = void 0;
const typeorm_1 = require("typeorm");
const criptomoeda_entity_1 = require("./entities/criptomoeda.entity");
require('dotenv').config();
const FonteDeDados = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.BD_HOST,
    port: Number(process.env.BD_PORT),
    username: process.env.BD_USERNAME,
    password: process.env.BD_PASSWORD,
    database: process.env.BD_DATABASE,
    synchronize: true,
    logging: false,
    entities: [criptomoeda_entity_1.Criptomoeda],
    subscribers: [],
    migrations: [],
    //Para testes locais:
    // type: "sqlite",
    // database: "./banco_de_dados.sqlite",
    // synchronize: true,
    // logging: false,
    // entities: [Criptomoeda],
    // subscribers: [],
    // migrations: [],
});
exports.BancoDeDados = FonteDeDados.initialize().then((f) => { return f.manager; });
