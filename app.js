const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

const { EventEmitter } = require('events');
const eventEmitter = new EventEmitter();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static('public'));

let inventory = [];

// Custom event to handle inventory updates
eventEmitter.on('updateInventory', (product) => {
    inventory.push(product);
});

// API endpoints
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html'); // Serve the HTML form
});

app.get('/inventory', (req, res) => {
    res.json(inventory);
});

// Handle form submission and add a product
app.post('/add-product', (req, res) => {
    const product = {
        name: req.body.name,
        quantity: req.body.quantity,
    };
    // Emit the custom event to update inventory
    eventEmitter.emit('updateInventory', product);
    res.redirect('/inventory'); // Redirect to the inventory display page
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
