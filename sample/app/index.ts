import 'reflect-metadata';

import {BindRoutes} from 'api-decorator';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

async function startup() {
    const app = express();

    app.use(
        bodyParser.urlencoded({
            extended: true,
            limit: '5mb',
        }),
    );
    app.use(
        bodyParser.json({
            limit: '25mb',
        }),
    );
    app.use(cors());

    const routes = await BindRoutes();
    app.use('/', routes);

    const port = 3000;
    app.listen(port, () => {
        console.log(`Server is listening on: ${port}`);
    });
}

startup();
