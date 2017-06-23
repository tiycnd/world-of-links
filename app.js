const fs = require('fs');
const path = require('path');
const express = require('express');
const mustacheExpress = require('mustache-express');
const app = express();

app.engine('mustache', mustacheExpress());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache')
app.set('layout', 'layout');
app.use('/static', express.static('static'));

// put routes here

app.listen(3000, function () {
    console.log('Express running on http://localhost:3000/.')
});
