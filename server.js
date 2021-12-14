const express = require('express')
const app = express()
const port = 3080

const rootFolder = '/home/cpttm/Documents/development/js-jupyter/docs/'
const path = require('path')
const fs = require('fs')
const util = require('util')

const readdir = util.promisify(fs.readdir)

async function getFileList(){
  return await readdir(rootFolder).then((files) => {
    return files.map((fileName) => {
      const filePath = path.join(rootFolder, fileName)
      const stats = fs.statSync(filePath);
      const isDirectory = stats.isDirectory();
      const fileSize = stats.size;
      return {
        fileName,
        isDirectory,
        fileSize
      }
    })
  })
}

app.get('/', async (req, res) => {
  const fileList = await getFileList()
  res.send(JSON.stringify(fileList))
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))
