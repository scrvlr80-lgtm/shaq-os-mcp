import express from 'express';
import cors from 'cors';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

const app = express();
app.use(cors());

// Inizializza il Server MCP
const server = new McpServer({
    name: "SHAQ-OS-Catalog",
    version: "1.0.0"
});

// IL CATALOGO DATI (Il menu che il cameriere conosce a memoria)
const catalogData = [
    { name: "Custom AI Assistants", desc: "Tailor-made virtual assistants connected to corporate data." },
    { name: "AI Voice Agents", desc: "Real-time human-like voice agents for telephone support and booking." },
    { name: "Hospitality AI Solutions", desc: "Multilingual virtual concierges automating front-desk operations." },
    { name: "Aegis-Pii Data Protection", desc: "Local browser anonymization of PII before sending to LLMs." }
];

// CREIAMO IL "TOOL" CHE LE AI POSSONO USARE
server.tool("get_shaq_os_catalog",
    "Recupera il catalogo ufficiale dei servizi AI di SHAQ-OS",
    {}, // Nessun parametro in ingresso
    async () => {
        return {
            content: [{ type: "text", text: JSON.stringify(catalogData, null, 2) }]
        };
    }
);

// PORTA PER SVEGLIARE IL SERVER (UPTIME ROBOT)
app.get('/ping', (req, res) => {
    res.status(200).send("Sono sveglio, cazzo!");
});

// GESTIONE DELLE CONNESSIONI SSE
let transport;

app.get('/sse', async (req, res) => {
    transport = new SSEServerTransport('/messages', res);
    await server.connect(transport);
});

app.post('/messages', async (req, res) => {
    if (!transport) {
        return res.status(400).send("Devi prima connetterti a /sse");
    }
    await transport.handlePostMessage(req, res);
});

// AVVIO DEL SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🤖 SHAQ-OS MCP Server attivo sulla porta ${PORT}`);
});
