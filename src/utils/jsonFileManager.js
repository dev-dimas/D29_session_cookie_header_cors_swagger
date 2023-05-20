const fs = require('fs').promises;
const path = require('path');

const readJSONFile = async (filePath) => {
  try {
    const fileData = await fs.readFile(filePath);
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === 'ENOENT') {
      fs.mkdir(path.dirname(filePath), { recursive: true });
    }
    return [];
  }
};

const writeJSONFile = async (filePath, data) => {
  try {
    const fileData = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, fileData);
  } catch (error) {
    console.error(`Gagal menulis file ${filePath}. Pesan error : ${error.message}`);
  }
};

const addDataToJSONFile = async (filePath, newData) => {
  const existingData = (await readJSONFile(filePath)) || [];
  existingData.push(newData);
  await writeJSONFile(filePath, existingData);
};

const updateDataInJSONFile = async (filePath, updatedData) => {
  const existingData = (await readJSONFile(filePath)) || [];

  const updatedDataIndex = existingData.findIndex((data) => data.id === updatedData.id);
  if (updatedDataIndex !== -1) {
    existingData[updatedDataIndex] = { ...existingData[updatedDataIndex], ...updatedData };
    await writeJSONFile(filePath, existingData);
    return existingData[updatedDataIndex];
  }

  return false;
};

const deleteDataFromJSONFile = async (filePath, deletedDataId) => {
  const existingData = (await readJSONFile(filePath)) || [];

  const newData = existingData.filter((data) => data.id !== deletedDataId);
  if (newData.length < existingData.length) {
    await writeJSONFile(filePath, newData);
    return newData;
  }

  return false;
};

const createDirectory = async (dirPath) => {
  try {
    await fs.access(path.resolve(dirPath), fs.constants.F_OK);
  } catch (error) {
    await fs.mkdir(dirPath, { recursive: true });
  }
};

class JSONFileManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.checkAndCreateDir();
  }

  async readAllData() {
    return readJSONFile(this.filePath);
  }

  async readOneData(id) {
    const data = await readJSONFile(this.filePath);
    if (!data) {
      return false;
    }
    const foundedData = data.find((datum) => datum.id === id);
    if (!foundedData) {
      return false;
    }
    return foundedData;
  }

  async addData(newData) {
    await addDataToJSONFile(this.filePath, newData);
  }

  async updateData(updatedData) {
    const updated = await updateDataInJSONFile(this.filePath, updatedData);
    if (!updated) {
      console.error(`Data dengan id ${updatedData.id} tidak dapat ditemukan pada file ${this.filePath}`);
    }
    return updated;
  }

  async deleteData(deletedDataId) {
    const deleted = await deleteDataFromJSONFile(this.filePath, deletedDataId);
    if (!deleted) {
      console.error(`Data dengan id ${deletedDataId} tidak dapat ditemukan pada file ${this.filePath}`);
    }
    return deleted;
  }

  // eslint-disable-next-line class-methods-use-this
  async checkAndCreateDir() {
    await createDirectory('data');
    await createDirectory('public/images');
    await createDirectory('tmp');
  }
}

module.exports = { JSONFileManager };
