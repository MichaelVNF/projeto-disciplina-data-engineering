import fetch from 'node-fetch';
import { CotacaoDTO } from '../dtos/cotacao.dto';

const URL_BASE = 'https://economia.awesomeapi.com.br/';
const URL_LAST = URL_BASE + 'last/';

export class CotacaoService {

    public static readonly COD_MOEDA = "USD";

    constructor(
        private readonly codMoedaConversao: string) {
    }

    public async coletar(): Promise<CotacaoDTO> {

        const response = await fetch(URL_LAST + CotacaoService.COD_MOEDA + '-' + this.codMoedaConversao);

        const dto = await response.json().then((c) => {
            return c[CotacaoService.COD_MOEDA + this.codMoedaConversao];
        });

        return dto;
    }

    public async obterValor() {
        return this.coletar().then((c) => {
            return parseFloat((c as any).ask)
        });
    }
}