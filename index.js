const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

let routes = require('./Routes');

routes.init(app);

app.listen(port, () => console.log(`App listening on port ${port}!`))