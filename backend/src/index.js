import 'dotenv/config'
import express from "express";
import cors from "cors";
import Mongo from './helper/mongoConnect.js'
import { routesv1 } from './controller/v1/index.js';
// import * as fs from 'fs'
// import * as path from 'path'
import { socketMain } from './controller/v1/socketController.js'
// import helmet from 'helmet';
// import compression from 'compression';
// import OS from 'os'

import { ErrorHelper, Err } from './helper/errorHelper.js';

// const __dirname = path.resolve();
const app = express();

function createFile(location) {
    if (!fs.existsSync(location)) {
        fs.mkdirSync(location);
    }
}

createFile("./public")
process.on('uncaughtException', (err) => console.log(err.name, err.message));
process.on('unhandledRejection', (err) => console.log(err.name, err.message));
app.use(compression({level: 6}))
app.use(express.static("./public"))
app.use(express.static("./uploads"))
// app.use(helmet())
app.use(cors())
app.use(express.json())
app.use('/api/v1', routesv1)

app.get('*', function (req, res, next) {
    try {
        if (fs.existsSync("./public/index.html")) {
            return res.sendFile(path.join(__dirname, 'public/index.html'));
        }
        else {
            return res.send("Upload the Client");
        }
    }
    catch (error) {
        const err = new Err(error.message, 500)
        next(err);
    }

})

app.use(ErrorHelper.errorHandler);

const main = async () => {
    const mongoConnection = await Mongo.connect();
    if (mongoConnection) {
        let server = await app.listen(process.env.PORT, () => {
            console.log(`App listining on port: ${process.env.PORT}`)
        })
        socketMain(server);
    }
    else {
        console.log("Mongo Connection Failed")
    }


}

main();