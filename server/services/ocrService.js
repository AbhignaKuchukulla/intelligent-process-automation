const Tesseract = require('tesseract.js');

async function processOCR(filePath) {
  const { data } = await Tesseract.recognize(filePath, 'eng');
  return data.text;
}

module.exports = { processOCR };
