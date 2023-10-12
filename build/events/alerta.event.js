"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertaEvent = void 0;
const banco_de_dados_data_1 = require("../database/banco_de_dados.data");
const criptomoeda_entity_1 = require("../database/entities/criptomoeda.entity");
const coincap_service_1 = require("../services/coincap.service");
const cotacao_service_1 = require("../services/cotacao.service");
const email_service_1 = require("../services/email.service");
const console_utils_1 = require("../utils/console.utils");
class AlertaEvent {
    constructor(nomeCriptomoeda, codMoedaConversao, valorAlerta) {
        this.nomeCriptomoeda = nomeCriptomoeda;
        this.codMoedaConversao = codMoedaConversao;
        this.valorAlerta = valorAlerta;
        this.coincapService = new coincap_service_1.CoincapService();
        this.cotacaoService = new cotacao_service_1.CotacaoService(codMoedaConversao);
        this.emailService = new email_service_1.EmailService();
        this.console = new console_utils_1.ConsoleUtils('ALERTA');
    }
    executar() {
        return __awaiter(this, void 0, void 0, function* () {
            const criptomoeda = yield this.lerDadosApiCoincap();
            const salvo = yield this.salvarNoBancoDeDados(criptomoeda);
            if (salvo) {
                //const criptomoeda = await this.lerUltimoRegistroBancoDeDados();
                if (criptomoeda != null) {
                    const alertar = criptomoeda.valor < this.valorAlerta;
                    this.console.log(`Valor da criptomoeda em ${this.codMoedaConversao}.....: ${criptomoeda.valor}`);
                    this.console.log(`Valor mínimo para alerta em ${this.codMoedaConversao}.: ${this.valorAlerta}`);
                    this.console.log(`Valor da criptmoeda < valor mínimo para alertar? ${alertar ? 'Sim' : 'Não'}`);
                    if (alertar)
                        this.enviarEmailDeAlerta(criptomoeda.valor, this.valorAlerta);
                    else
                        this.console.log('Não houve a necessidade de alertar por e-mail');
                }
            }
        });
    }
    executarItem(contador) {
        return __awaiter(this, void 0, void 0, function* () {
            this.console.logSeparacao();
            this.console.log('Execução n°: ' + contador);
            yield this.executar();
        });
    }
    executarComIntevalo(milisegundos) {
        return __awaiter(this, void 0, void 0, function* () {
            this.console.log('Executando...');
            this.console.logSeparacao();
            this.console.log(`Intervalo de execução: ${milisegundos} ms`);
            let contador = 1;
            this.executarItem(contador++);
            setInterval(() => __awaiter(this, void 0, void 0, function* () {
                yield this.executarItem(contador);
                contador++;
            }), milisegundos);
        });
    }
    lerDadosApiCoincap() {
        return __awaiter(this, void 0, void 0, function* () {
            this.console.log('Lendo dados da API Coincap');
            const coincap = yield this.coincapService.coletarDados(this.nomeCriptomoeda);
            let valorConvertido = parseFloat(coincap.data.priceUsd);
            if (this.codMoedaConversao !== cotacao_service_1.CotacaoService.COD_MOEDA) {
                valorConvertido = valorConvertido * (yield this.cotacaoService.obterValor());
            }
            let criptomoeda = new criptomoeda_entity_1.Criptomoeda();
            criptomoeda.nome = coincap.data.name;
            criptomoeda.moeda = this.codMoedaConversao;
            criptomoeda.valor = Math.round(valorConvertido);
            return criptomoeda;
        });
    }
    salvarNoBancoDeDados(criptomoeda) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.console.log('Salvando criptomoeda no banco de dados');
                yield (yield banco_de_dados_data_1.BancoDeDados).save(criptomoeda);
            }
            catch (error) {
                this.console.log('Erro ao salvar a criptomoeda no banco de dados');
                return false;
            }
            return true;
        });
    }
    // private async lerUltimoRegistroBancoDeDados() {
    //     this.console.log('Lendo último registro no banco de dados');
    //     const criptomoeda = await (await BancoDeDados).findOne(Criptomoeda, {
    //         where: {},
    //         order: { id: 'DESC' }
    //     });
    //     return criptomoeda;
    // }
    enviarEmailDeAlerta(valorCriptmoeda, valorAlerta) {
        return __awaiter(this, void 0, void 0, function* () {
            this.console.log('Enviando e-mail de alerta');
            const conteudo = `
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                        }
                    </style>
                </head>
                <body>  
                    <h2 style='color: red'>ALERTA<h2>
                    <hr>
                    <p>O valor da criptomoeda '${this.nomeCriptomoeda}' atingiu o valor mínimo!</p>
                    <br>
                    <p>Valor da criptomoeda em ${this.codMoedaConversao}.....: ${valorCriptmoeda}</p>
                    <p>Valor mínimo para alerta em ${this.codMoedaConversao}.: ${valorAlerta}</p>
                    <hr>
                    <h3>Serviço de alerta - Disciplina 'Data Enginnering'</h3>
                </body>
            </html>
        `;
            const enviado = yield this.emailService.enviar(`[ALERTA] - Criptomoeda '${this.nomeCriptomoeda}' abaixo do valor mínimo!`, conteudo);
            if (enviado)
                this.console.log('E-mail enviado com sucesso!');
            else
                this.console.log('Não foi possível enviar o e-mail!');
        });
    }
}
exports.AlertaEvent = AlertaEvent;
