import { BancoDeDados } from "../database/banco_de_dados.data";
import { Criptomoeda } from "../database/entities/criptomoeda.entity";
import { CoincapService } from "../services/coincap.service";
import { CotacaoService } from "../services/cotacao.service";
import { EmailService } from "../services/email.service";
import { ConsoleUtils } from "../utils/console.utils";

export class AlertaEvent {

    private readonly coincapService: CoincapService;
    private readonly cotacaoService: CotacaoService;
    private readonly emailService: EmailService;
    private readonly console: ConsoleUtils;

    constructor(private readonly nomeCriptomoeda: string, private readonly codMoedaConversao: string, private readonly valorAlerta: number) {
        this.coincapService = new CoincapService();
        this.cotacaoService = new CotacaoService(codMoedaConversao);
        this.emailService = new EmailService();
        this.console = new ConsoleUtils('ALERTA');
    }

    public async executar() {
        const criptomoeda = await this.lerDadosApiCoincap();
        const salvo = await this.salvarNoBancoDeDados(criptomoeda);

        if (salvo) {
            //const criptomoeda = await this.lerUltimoRegistroBancoDeDados();

            if (criptomoeda != null) {
                const alertar = criptomoeda.valor < this.valorAlerta;
                this.console.log(`Valor da criptomoeda em ${this.codMoedaConversao}.....: ${criptomoeda.valor}`);
                this.console.log(`Valor mínimo para alerta em ${this.codMoedaConversao}.: ${this.valorAlerta}`);
                this.console.log(`Valor da criptmoeda < valor mínimo para alertar? ${alertar ? 'Sim' : 'Não'}`)

                if (alertar)
                    this.enviarEmailDeAlerta(criptomoeda.valor, this.valorAlerta);
                else
                    this.console.log('Não houve a necessidade de alertar por e-mail');
            }
        }
    }

    private async executarItem(contador: number) {
        this.console.logSeparacao();
        this.console.log('Execução n°: ' + contador);

        await this.executar();
    }

    public async executarComIntevalo(milisegundos: number) {
        this.console.log('Executando...');
        this.console.logSeparacao();
        this.console.log(`Intervalo de execução: ${milisegundos} ms`);
        let contador = 1;

        this.executarItem(contador++);
        setInterval(async () => {

            await this.executarItem(contador);
            contador++;

        }, milisegundos);
    }

    private async lerDadosApiCoincap() {
        this.console.log('Lendo dados da API Coincap');

        const coincap = await this.coincapService.coletarDados(this.nomeCriptomoeda);

        let valorConvertido = parseFloat(coincap.data.priceUsd);
        if (this.codMoedaConversao !== CotacaoService.COD_MOEDA) {
            valorConvertido = valorConvertido * await this.cotacaoService.obterValor();
        }

        let criptomoeda = new Criptomoeda();
        criptomoeda.nome = coincap.data.name;
        criptomoeda.moeda = this.codMoedaConversao;
        criptomoeda.valor = Math.round(valorConvertido);

        return criptomoeda;
    }

    private async salvarNoBancoDeDados(criptomoeda: Criptomoeda) {
        try {
            this.console.log('Salvando criptomoeda no banco de dados');
            await (await BancoDeDados).save(criptomoeda);
        } catch (error) {
            this.console.log('Erro ao salvar a criptomoeda no banco de dados');
            return false;
        }

        return true;
    }

    // private async lerUltimoRegistroBancoDeDados() {
    //     this.console.log('Lendo último registro no banco de dados');

    //     const criptomoeda = await (await BancoDeDados).findOne(Criptomoeda, {
    //         where: {},
    //         order: { id: 'DESC' }
    //     });

    //     return criptomoeda;
    // }

    private async enviarEmailDeAlerta(valorCriptmoeda: number, valorAlerta: number) {
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

        const enviado = await this.emailService.enviar(`[ALERTA] - Criptomoeda '${this.nomeCriptomoeda}' abaixo do valor mínimo!`, conteudo);

        if (enviado)
            this.console.log('E-mail enviado com sucesso!');
        else
            this.console.log('Não foi possível enviar o e-mail!');
    }
}