const express = require('express');
const app = express();
const port = 3000;

let currentKey = generateRandomKey();

// Função para gerar a chave aleatória
function generateRandomKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let key = "";
  for (let i = 0; i < 16; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

// Endpoint para obter a chave atual
app.get('/key', (req, res) => {
  res.json({ key: currentKey });
});

// Endpoint para gerar uma nova chave
app.post('/generate', (req, res) => {
  currentKey = generateRandomKey();
  res.json({ key: currentKey });
});

// Função para gerar uma nova chave a cada 24 horas
setInterval(() => {
  currentKey = generateRandomKey();
  console.log("Nova chave gerada: ", currentKey);
}, 86400000); // 24 horas em milissegundos

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
