const fs = require('fs');

function createDirectory() {
  const path = './utils/ABIs';
  if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
}

function getABIs() {
  const dir = fs.readdirSync('./artifacts/contracts');
  dir.forEach((d) => {
    const file = `./artifacts/contracts/${d}/Verifier.json`;
    if (fs.existsSync(file)) {
      createDirectory();
      const jsonString = fs.readFileSync(file, 'utf-8');
      const json = JSON.parse(jsonString);
      const { abi } = json;

      const fileName = d.split('.')[0];
      const outputFile = `./utils/ABIs/${fileName}.json`;
      fs.writeFileSync(outputFile, JSON.stringify(abi));
    }
  });
}

getABIs();
