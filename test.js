const fs = require('fs');
const path = require('path');

// Pega o diretório atual
const currentDirectory = __dirname;

function listFiles(directory) {
  // Lê os arquivos e diretórios no diretório atual
  fs.readdir(directory, (err, files) => {
    if (err) {
      return console.error('Erro ao ler o diretório:', err);
    }

    files.forEach(file => {
      const filePath = path.join(directory, file);

      // Verifica se é um diretório ou arquivo
      fs.stat(filePath, (err, stats) => {
        if (err) {
          return console.error('Erro ao obter informações do arquivo:', err);
        }

        if (stats.isDirectory()) {
          console.log('Diretório:', filePath);
          // Se for um diretório, chama recursivamente para listar os arquivos dentro
          listFiles(filePath);
        } else {
          console.log('Arquivo:', filePath);
        }
      });
    });
  });
}

// Chama a função para listar os arquivos no diretório atual
listFiles(currentDirectory);
