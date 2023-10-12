
export class ConsoleUtils {

    constructor(private readonly prefix: string) {
    }

    public logSeparacao() {
        this.log('--------------------------------------------------------------');
    }

    public log(log: any) {
        console.log(`[${this.prefix}] ` + log);
    }
}