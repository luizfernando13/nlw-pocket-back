const fs = require('fs');
const path = require('path');

// Pega o diretório atual
const currentDirectory = __dirname;

// Função para listar arquivos e diretórios recursivamente, ignorando "node_modules" e ".git"
function listFiles(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      return console.error('Erro ao ler o diretório:', err);
    }

    files.forEach(file => {
      const filePath = path.join(directory, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          return console.error('Erro ao obter informações do arquivo:', err);
        }

        if (stats.isDirectory()) {
          if (file.includes("node_modules") || file.includes(".git")) {
            return; // Ignora os diretórios node_modules e .git
          }
          console.log('Diretório:', filePath);
          // Se for um diretório, entra nele recursivamente
          listFiles(filePath);
        } else {
          //console.log('Arquivo:', filePath);
        }
      });
    });
  });
}

// Função para percorrer todos os diretórios da máquina
function listAllDirectories(startingPath) {
  fs.readdir(startingPath, (err, files) => {
    if (err) {
      return console.error('Erro ao ler o diretório:', err);
    }

    files.forEach(file => {
      const filePath = path.join(startingPath, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          return console.error('Erro ao obter informações do arquivo:', err);
        }

        if (stats.isDirectory()) {
          if (file.includes("node_modules") || file.includes(".git")) {
            return; // Ignora "node_modules" e ".git"
          }
          console.log('Diretório:', filePath);
          // Chama a função recursivamente para entrar em cada subdiretório
          listAllDirectories(filePath);
        } else {
          //console.log('Arquivo:', filePath);
        }
      });
    });
  });
}

// Chama a função para listar os arquivos e diretórios da máquina inteira
const rootPath = process.platform === 'win32' ? 'C:\\' : '/'; // Define o caminho raiz para Windows ou Linux/macOS
listAllDirectories(rootPath);
