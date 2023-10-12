"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const alerta_event_1 = require("./events/alerta.event");
new alerta_event_1.AlertaEvent('bitcoin', 'BRL', 130000).executarComIntevalo(60000);
