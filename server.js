const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const util = require("util");

const port = 3080;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const rootFolder = "./docs/";

const readdir = util.promisify(fs.readdir);

async function getFileList(folderPath = "/") {
	const targetPath = path.join(rootFolder, folderPath);
	return await readdir(targetPath).then((files) => {
		return files.map((fileName) => {
			const filePath = path.join(rootFolder, fileName);
			const stats = fs.statSync(filePath);
			const isDirectory = stats.isDirectory();
			const fileSize = stats.size;
			return {
				fileName,
				isDirectory,
				fileSize,
			};
		});
	});
}

app.get("/files", async (req, res) => {
	console.log(req.query);
	const fileList = await getFileList(req.query.path);
	console.log(fileList);
	res.send(JSON.stringify(fileList));
});

app.post("/files", async (req, res) => {
	console.log(req.body);
	const { path: dirPath, fileName, isDirectory } = req.body;

	const filePath = path.join(rootFolder, dirPath, fileName);
	console.log(filePath);

	if (isDirectory && !fs.existsSync(filePath)) {
		fs.mkdirSync(filePath);
	}

	res.sendStatus(200);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
