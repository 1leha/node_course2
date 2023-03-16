const path = require('path');
const fs = require('fs').promises;

/**
 * Read and write operations exaple.
 * @returns {Promise<void>}
 */
const readWriteExample = async () => {
  try {
    const pathToFile = path.join('files', 'book.txt');

    const readResult = await fs.readFile(pathToFile);

    const txt = readResult.toString();
    // console.log(txt);

    const dir = 'files';

    const listDirContent = await fs.readdir(dir);
    const dirStat = await fs.lstat(pathToFile);

    console.log(dirStat.isDirectory());

    // ============================
    const pathToJson = path.join('files', 'data.json');

    const jsonResult = await fs.readFile(pathToJson);

    const json = JSON.parse(jsonResult);

    console.log('||=============>>>>>>>>>>>');
    console.log(json);
    console.log('<<<<<<<<<<<=============||');

    json.d = 'Jimi Hendrix';

    await fs.writeFile('newJson.json', JSON.stringify(json));
  } catch (err) {
    console.log('||=============>>>>>>>>>>>');
    console.log(err.message);
    console.log('<<<<<<<<<<<=============||');
  }
};
readWriteExample();
