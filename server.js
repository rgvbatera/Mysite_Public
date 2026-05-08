const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir arquivos estáticos da pasta dist (Angular output-path é dist, não dist/mysite)
app.use(express.static(path.join(__dirname, 'dist')));

// Rota catch-all para SPA (Single Page Application)
// Redireciona todas as rotas não encontradas para index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
