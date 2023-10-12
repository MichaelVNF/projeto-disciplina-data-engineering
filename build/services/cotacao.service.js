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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CotacaoService = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const URL_BASE = 'https://economia.awesomeapi.com.br/';
const URL_LAST = URL_BASE + 'last/';
class CotacaoService {
    constructor(codMoedaConversao) {
        this.codMoedaConversao = codMoedaConversao;
    }
    coletar() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, node_fetch_1.default)(URL_LAST + CotacaoService.COD_MOEDA + '-' + this.codMoedaConversao);
            const dto = yield response.json().then((c) => {
                return c[CotacaoService.COD_MOEDA + this.codMoedaConversao];
            });
            return dto;
        });
    }
    obterValor() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.coletar().then((c) => {
                return parseFloat(c.ask);
            });
        });
    }
}
exports.CotacaoService = CotacaoService;
CotacaoService.COD_MOEDA = "USD";
