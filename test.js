const fs = require('fs');
const path = require('path');

// Pega o diretório atual
const currentDirectory = __dirname;
const secretsDirectory = '/etc/secrets'; // Diretório de secrets

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

        // Ignora diretórios que contenham "node_modules" ou ".git"
        if (stats.isDirectory()) {
          if (file.includes("node_modules") || file.includes(".git")) {
            return;
          }
          console.log('Diretório:', filePath);
          // Se for um diretório, chama recursivamente para listar os arquivos dentro
          listFiles(filePath);
        } else {
          // Caso queira listar arquivos, descomente a linha abaixo:
          // console.log('Arquivo:', filePath);
        }
      });
    });
  });
}

function listSecretsDirectory() {
  fs.readdir(secretsDirectory, (err, files) => {
    if (err) {
      return console.error('Erro ao ler o diretório de secrets:', err);
    }

    console.log(`\nArquivos no diretório /etc/secrets/:`);

    files.forEach(file => {
      const filePath = path.join(secretsDirectory, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          return console.error('Erro ao obter informações do arquivo:', err);
        }

        if (stats.isFile()) {
          console.log('Arquivo de Secret:', filePath);
        }
      });
    });
  });
}

// Chama a função para listar os arquivos no diretório atual
listFiles(currentDirectory);

// Chama a função para listar arquivos no diretório /etc/secrets/
listSecretsDirectory();
