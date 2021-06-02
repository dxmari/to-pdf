const express = require('express');
const fs = require('fs');
const path = require('path');
const html_to_pdf = require('html-pdf-node');
const app = express();
const { json, urlencoded, raw } = require('body-parser');

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(raw({ type: 'text/html' }));

app.post('/to-pdf', async (req, res) =>{
  let file = { content: req.body };
  try {
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);
    // const pdfBuffer = "";
    fs.writeFileSync(path.resolve(__dirname, 'sample.pdf'), pdfBuffer);
    res.json({
      pdfBuffer : pdfBuffer
    })
  } catch (error) {
    res.status(400).json({
      error
    })
  }
})

app.get('/get-file', (req, res) =>{
  res.sendFile(path.resolve(__dirname, 'sample.pdf'))
})

app.listen(9001, () => {
  console.log('Server runs on port 9001')
})