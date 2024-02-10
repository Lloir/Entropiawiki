const multer  = require('multer');
const upload = multer({ dest: 'uploads/' }); // perhaps you'd want to save files somewhere else

app.post('/upload-csv', upload.single('file'), (req, res) => {
    // 'file' is the name of the file field in the form
    console.log(req.file); // contains info about the file

    fs.createReadStream(req.file.path)
        .pipe(csv.parse({ headers: true }))
        .on('data', row => {
            // here is where you modify your database with the CSV row data
        })
        .on('end', () => {
            res.send('File has been processed successfully');
        });
});