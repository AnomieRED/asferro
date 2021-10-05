require('dotenv').config();
const express = require('express');
const router = require('./routers/router');

const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200', log: 'trace' });

const app = express();
const PORT = process.env.SERVER_PORT || 8080;

app.use(express.json());
app.use('/', router);

app.listen(PORT, () => {
	console.log(`Server has been started on port ${PORT}`);
});
