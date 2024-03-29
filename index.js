const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const html_to_pdf = require('html-pdf-node');
const app = express();
const { json, urlencoded, raw } = require('body-parser');

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(raw({ type: 'text/html' }));


const getPDFOpts = (req) => {
  let pdfOpts = {};
  try {
    if (req.query.options) {
      pdfOpts = JSON.parse(req.query.options);
      console.log('pdfOpts1', pdfOpts)
      if(typeof pdfOpts !== 'object'){
        pdfOpts = JSON.parse(pdfOpts)
        console.log('pdfOpts2', pdfOpts)
      }
    }
    return pdfOpts;
  } catch (error) {
    return pdfOpts;
  }
}

app.post('/to-pdf', async (req, res) => {
  // let file = { content: req.body.toString() };
  let pdfOpts = getPDFOpts(req);
  const filename = pdfOpts.filename;
  delete pdfOpts.filename;
  console.log('pdfOpts3', pdfOpts)
  const options = { format: 'A4', margin: { top: 80, bottom: 80 }, ...pdfOpts }
  try {
    const filepath = path.resolve(__dirname, 'outputs/sample.html');
    fs.writeFileSync(filepath, req.body);
    // let file = { url : "http://localhost:9001/pdf" }
    let file = { url : "http://topdf.dxmari.com/pdf" }
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);
    fs.writeFileSync(path.resolve(__dirname, 'sample.pdf'), pdfBuffer);
    res.json({
      pdfBuffer: pdfBuffer
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error
    })
  }
})

app.get('/asset/img.jpg', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'img.jpg'))
})

app.get('/get-file', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'sample.pdf'))
})

app.get('/pdf', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'outputs/sample.html'))
})

app.get('/outputs/*', (req, res) =>{
  res.sendFile(path.resolve(__dirname, req.path.replace('/', '')));
})

// app.get('*', (req, res) =>{
//   res.sendFile(path.resolve(__dirname, req.path.replace('/', '')));
// })

const server = http.createServer(app);
server.listen(9001, () => {
  console.log('Server runs on port 9001')
})