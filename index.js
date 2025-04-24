const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_API_KEY;
// Add your access token here

// TODO: ROUTE 1 - Homepage route
app.get('/', async (req, res) => {
    const url = 'https://api.hubapi.com/crm/v3/objects/2-43822362?properties=name,bio,weapon'; // Replace with your custom object ID

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(url, { headers });
        const records = response.data.results;
        res.render('homepage', { title: 'Custom Object Records', records });
    } catch (err) {
        console.error(err);
        res.send('Failed to fetch custom object records.');
    }
});

// TODO: ROUTE 2 - Route to render form for creating/updating custom object
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// TODO: ROUTE 3 - POST route to handle form submission
app.post('/update-cobj', async (req, res) => {
    const { name, bio, weapon } = req.body;

    const customObjectData = {
        properties: {
            name,
            bio,
            weapon
        }
    };

    const url = 'https://api.hubapi.com/crm/v3/objects/2-43822362'; // Replace with your custom object ID

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(url, customObjectData, { headers });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.send('Failed to create custom object record.');
    }
});


// Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
