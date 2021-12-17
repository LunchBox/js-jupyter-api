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

async function getFileList() {
	return await readdir(rootFolder).then((files) => {
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

app.get("/", async (req, res) => {
	const fileList = await getFileList();
	res.send(JSON.stringify(fileList));
});

app.post("/files", async (req, res) => {
	console.log(req.body);
	const { fileName, isDirectory } = req.body;

	const filePath = path.join(rootFolder, fileName);
	console.log(filePath);

	if (isDirectory && !fs.existsSync(filePath)) {
		fs.mkdirSync(filePath);
	}

	res.sendStatus(200);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
