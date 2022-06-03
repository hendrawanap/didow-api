/* eslint-disable no-underscore-dangle */
const { default: axios } = require('axios');
const { createWriteStream, createReadStream } = require('fs');
const { unlink } = require('fs/promises');
const FormData = require('form-data');
const path = require('path');
const { analyzeHandwritingPayload: validatePayload } = require('../validations/index').handwritings;

const STORAGE_PATH = '../../../temp';

const saveFile = async (url, fileStream) => {
  const targetUrl = path.join(__dirname, STORAGE_PATH, url);
  const writeStream = createWriteStream(targetUrl);
  const streamPromise = new Promise((resolve, reject) => {
    writeStream.on('error', (error) => reject(error));
    writeStream.on('finish', () => {
      writeStream.close();
      resolve(targetUrl);
    });
    fileStream.pipe(writeStream);
  });

  return streamPromise;
};

const deleteFile = async (url) => {
  await unlink(url);
  return `Success deleted: ${url}`;
};

const analyzeHandwriting = async (request, h) => {
  const { img, expectedWord } = request.payload;
  const { boom } = request.server.app;
  const validation = validatePayload.validate({ img: img?._data, expectedWord });

  if (validation.error) {
    return boom.badRequest();
  }

  // Temporary save the image file
  const targetUrl = await saveFile(`${Date.now()}-${img.hapi.filename}`, img);

  const formData = new FormData();
  formData.append('handwriting', createReadStream(targetUrl));
  formData.append('data', JSON.stringify({ expectedWord }));

  let response;

  try {
    const { data } = await axios.post(process.env.ML_API_URL, formData);
    response = h.response({
      data,
      message: 'success',
    }).code(200);
  } catch (error) {
    response = boom.badImplementation();
  }

  // Delete temporary image file
  await deleteFile(targetUrl);
  return response;
};

module.exports = { analyzeHandwriting };
