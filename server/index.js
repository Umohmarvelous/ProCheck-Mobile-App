const express = require('express');
const http = require('http');
const { Pool } = require('pg');
const WebSocket = require('ws');

const app = express();
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/givotodo' });

app.get('/health', async (req, res) => {
  try {
    const client = await pool.connect();
    client.release();
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('ws connected');
  ws.on('message', (msg) => console.log('ws msg', msg.toString()));
  ws.send(JSON.stringify({ type: 'welcome' }));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
