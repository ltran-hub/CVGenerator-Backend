require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const apiRouter = require('./routes');
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

app.use(cors());

app.use(express.json());

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: '',
            version: '1.0.0'
        },
        servers: [
            {
                url: process.env.SERVER_URL || 'http://localhost:3000/'
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                BearerAuth: []
            }
        ]
    },
    apis: ['./src/routes/*.js']
}

const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('Connection has been etablished successfully');
    })
    .catch((error) => {
        console.error('Unable to connect database: ', error);
    });

app.get('/', (req,res) =>  {
    res.redirect('/api-docs');
})

app.use('/api', apiRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})