import * as nodemailer from "nodemailer";

require('dotenv').config();

export class EmailService {

    public async enviar(titulo: string, conteudo: string): Promise<boolean> {

        let opcoesDoEmail = {
            from: process.env.SMTP_EMAIL_FROM,
            to: process.env.SMTP_EMAIL_TO,
            subject: titulo,
            html: conteudo
        };

        const transporte = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            }
        });

        try {
            await transporte.sendMail(opcoesDoEmail);
        } catch (error) {
            console.log(error);
            return false;
        }

        return true;
    }
}
