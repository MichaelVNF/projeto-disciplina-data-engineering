import { AlertaEvent } from "./events/alerta.event";

new AlertaEvent('bitcoin', 'BRL', 130_000).executarComIntevalo(60_000);