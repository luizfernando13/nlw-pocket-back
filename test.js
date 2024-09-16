const fs = require('fs');
const path = require('path');

// Função para percorrer todos os diretórios da máquina, ignorando "node_modules", ".git" e "/proc"
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
          // Ignorar "node_modules", ".git" e "/proc"
          if (file.includes("node_modules") || file.includes(".git") || filePath === '/proc') {
            return;
          }
          console.log('Diretório:', filePath);
          // Chama a função recursivamente para entrar em cada subdiretório
          listAllDirectories(filePath);
        } else {
          console.log('Arquivo:', filePath);
        }
      });
    });
  });
}

// Função para listar arquivos apenas no diretório /etc/secrets/
async function listSecretsDirectory() {
  const secretsDirectory = './etc/secrets';

  fs.readdir(secretsDirectory, (err, files) => {
    if (err) {
      return console.error('Erro ao ler o diretório /etc/secrets:', err);
    }

    console.log(`\nArquivos no diretório /etc/secrets/:`);

    files.forEach(file => {
      const filePath = path.join(secretsDirectory, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          return console.error('Erro ao obter informações do arquivo:', err);
        }

        if (stats.isFile()) {
          console.log('Arquivo:', filePath);
        }
      });
    });
  });
}

// Chama a função para listar os arquivos e diretórios da máquina inteira
const rootPath = process.platform === 'win32' ? 'C:\\' : '/';
// Chama a função para listar arquivos apenas no diretório /etc/secrets/
await listSecretsDirectory();
listAllDirectories(rootPath);


