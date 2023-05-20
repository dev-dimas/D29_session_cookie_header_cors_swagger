/* eslint-disable no-plusplus */
const { random } = require('@lukeed/csprng');

let IDX = 256;
const HEX = [];
const SIZE = 256 * 16;
let BUFFER;
while (IDX--) HEX[IDX] = (IDX + 256).toString(16).substring(1);

/**
 * Membuat UID berdasarkan crypto dan panjang yang diinginkan.
 * @param {number} length - Panjang UID yang diinginkan
 * @returns {string} - UID yang dihasilkan.
 */
const generateBarcode = (length) => {
  let str = '';
  const tmp = length || 11;
  let num = (1 + tmp) / 2 || 0;
  if (!BUFFER || IDX + num > SIZE) {
    BUFFER = random(SIZE);
    IDX = 0;
  }

  while (num--) {
    str += HEX[BUFFER[IDX++]];
  }

  return str.substring(0, tmp);
};

module.exports = { generateBarcode };
