// server.js
const WebSocket = require('ws');
const https = require('https');

const DEEPGRAM_API_KEY = '937eafa3da8bbeb65d011cb7ccddd76dec03e373';

const wss = new WebSocket.Server({ port: 8080 });

console.log('✅ Proxy server WebSocket berjalan di port 8080');

wss.on('connection', (clientSocket) => {
  console.log('🔌 ESP32 terhubung ke proxy');

  const dgSocket = new WebSocket('wss://api.deepgram.com/v1/listen?language=id&encoding=linear16&sample_rate=16000&channels=1&punctuate=true&smart_format=true', {
    headers: {
      Authorization: `Token ${DEEPGRAM_API_KEY}`
    }
  });

  dgSocket.on('open', () => {
    console.log('🌐 Terhubung ke Deepgram');
  });

  dgSocket.on('message', (data) => {
    clientSocket.send(data); // kirim balik hasil ke ESP32
  });

  dgSocket.on('close', () => {
    console.log('❌ Koneksi ke Deepgram terputus');
  });

  clientSocket.on('message', (data) => {
    dgSocket.send(data); // kirim data dari ESP ke Deepgram
  });

  clientSocket.on('close', () => {
    dgSocket.close();
    console.log('❌ ESP32 terputus');
  });
});
