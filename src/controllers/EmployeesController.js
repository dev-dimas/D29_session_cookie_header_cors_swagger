const fs = require('fs').promises;
const path = require('path');

const { generateId } = require('../utils/idGenerator');
const { JSONFileManager } = require('../utils/jsonFileManager');

const dataFileManager = new JSONFileManager(path.resolve('data/employees.json'));

const getAllEmployee = async (req, res, next) => {
  try {
    await dataFileManager.checkAndCreateDir();
    const allData = await dataFileManager.readAllData();
    res.send({ employees: allData, error: false });
  } catch (err) {
    const error = new Error('Something went wrong! :(.');
    error.status = 500;
    next(error);
  }
};

const addEmployee = async (req, res, next) => {
  try {
    await dataFileManager.checkAndCreateDir();
    const id = `E${generateId()}`;
    const { body } = req;

    if (body.nama && body.alamat && body.usia && typeof Math.abs(parseInt(body.usia)) === 'number' && body.jenis_kelamin) {
      let { nama, alamat, usia, jenis_kelamin } = body;
      jenis_kelamin = `${jenis_kelamin.charAt(0).toUpperCase()}${jenis_kelamin.slice(1)}`;
      if (jenis_kelamin !== 'Pria' && jenis_kelamin !== 'Wanita') {
        throw new Error('Bad request!.');
      }

      const newData = {
        id,
        nama,
        alamat,
        usia: Math.abs(parseInt(usia)),
        jenis_kelamin,
      };
      await dataFileManager.addData(newData);
      res.send({ new_data: newData, error: false });
    } else {
      throw new Error('Bad request!.');
    }
  } catch (err) {
    if (err.message) {
      err.status = 400;
    } else {
      err.message = 'Something went wrong! :(.';
      err.status = 500;
    }
    next(err);
  }
};

const getEmployee = async (req, res, next) => {
  try {
    await dataFileManager.checkAndCreateDir();
    const { id } = req.params;
    const data = await dataFileManager.readOneData(id);
    if (!data) {
      throw new Error('Not found!.');
    }
    res.send({ ...data });
  } catch (err) {
    if (err.message) {
      err.status = 404;
    } else {
      err.message = 'Something went wrong! :(.';
      err.status = 500;
    }
    next(err);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    await dataFileManager.checkAndCreateDir();
    const { id } = req.params;
    const { body } = req;

    if (body.nama && body.alamat && body.usia && typeof Math.abs(parseInt(body.usia)) === 'number' && body.jenis_kelamin) {
      let { nama, alamat, usia, jenis_kelamin } = body;
      jenis_kelamin = `${jenis_kelamin.charAt(0).toUpperCase()}${jenis_kelamin.slice(1)}`;

      if (jenis_kelamin !== 'Pria' && jenis_kelamin !== 'Wanita') {
        throw new Error('Bad request!.');
      }

      const updatedData = {
        id,
        nama,
        alamat,
        usia: Math.abs(parseInt(usia)),
        jenis_kelamin,
      };

      const isUpdated = await dataFileManager.updateData(updatedData);

      if (!isUpdated) {
        throw new Error('Not found!.');
      }

      res.send({ updated_data: isUpdated, error: false });
    } else {
      throw new Error('Bad request!.');
    }
  } catch (err) {
    if (err.message) {
      err.status = 400;
    } else {
      err.message = 'Something went wrong! :(.';
      err.status = 500;
    }
    next(err);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isDeleted = await dataFileManager.deleteData(id);
    if (!isDeleted) {
      throw new Error('Not found!.');
    }
    res.send({ message: 'OK!.', error: false });
  } catch (err) {
    if (err.message) {
      err.status = 404;
    } else {
      err.message = 'Something went wrong! :(.';
      err.status = 500;
    }
    next(err);
  }
};

module.exports = {
  getAllEmployee,
  addEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
};
