# PROJETO - DISCIPLINA - DATA ENGINEERING

Projeto da disciplina de Data Engineering (Engenharia de Dados) que tem como objetivo realizar o monitoramento das flutuações do valor da criptomoeda 'Bitcoin'.

Este projeto consiste em:
- Realizar a leitura do valor da criptomoeda em dólar, através da API Coincap (https://docs.coincap.io/);
- Realizar a leitura da cotação da moeda a ser apresentada (caso não queira dólar), convertendo o valor da criptomoeda, através da API de cotações (https://docs.awesomeapi.com.br/api-de-moedas), se necessário.
- Salvar os dados, já tratados, da criptomoeda em um banco de dados MySQL na nuvem;
- Realizar a verificação do valor atual da criptomoeda, comparando-o com um valor mínimo previamente parametrizado, para que seja enviado um e-mail de alerta, caso necessário.

<br/>

## Configurações para execução 


### Banco de dados e servidor SMTP

Na pasta raíz do projeto, encontra-se um arquivo do tipo '.env' que permite a configuração do banco de dados (testado com um banco de dados em nuvem) e do servidor SMTP (testado com um serviço de caixas de entrada para e-mails - Mailtrip).
<br/>
<br/>

### Arquivos de classe 
 
Na pasta 'src/main.ts', encontra-se a invocação do método principal, através da classe '*AlertaEvent*'. No qual, recebe como parâmetro o nome da criptomoeda ("Bitcoin"), o valor a ser apresentado/registrado ("BRL") e o valor mínimo para efetuar um alerta ("R$ 130.000,00").

O método principal '*executarComIntevalo()*', recebe como parâmetro o tempo em milisegundos (60 segundos) para o intervalo entre cada execução/evento.
<br/>
<br/>

### Comando para execução 
 
Este projeto foi construído baseado em Node.js, utilizando o gerenciador de pacotes "npm", logo para executar este código em um ambiente com essas configurações, utilize os seguintes comandos, em ordem e via terminal, na pasta raiz do projeto:

- Comando para instalar todas as dependências:
    ```
    npm install
    ```

- Comando para executar o código:
    ```
    npm run start
    ```
<br/>

## Testes 
<br/>
O projeto foi homologado utilizando o serviço gratuito de e-mail SMTP Mailtrip (https://mailtrap.io/), a fim de facilitar o controle e envio dos e-mails, já que a além do servidor SMTP ofertado, há na plataforma a concentração e análise de todas as informações do remetente, destinatário e caixa de entrada.
<br/>
<br/>
Além disso, utilizamos o serviço gratuito de banco de dados em nuvem (podendo ser: Amazon RDS - AWS, Autonomous Database - Oracle Cloud ou Cloud SQL - Google Cloud Platform, por exemplo), visto que há suporte para instâncias do tipo MySQL.
<br/>
<br/>
Todas essas configurações de ambiente são possíveis através do arquivo de parametrizações, já mencionado (".env").
<br/>
<br/>


## Integrantes - Turma MBA ES_25:
<br/>

- Ariadne Pivaro Martines Dos Santos
- Lucas Oliveira De Souza
- Michael Vinicius Nascimento Ferreira