import express from 'express'; 
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import cors from 'cors';
import { getEnvs } from './envs.mjs';
import winston from 'winston';
import fs from 'fs';
import admin_router from './Admin_route.mjs';
import user_router from './User_route.mjs';
// 1. Initialize
const ENV = getEnvs();
console.log({ENV});
const app = express();
app.use(cors());

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'app.log' // ooutputs logs to the console and a file named app.log  
        })
    ]
});

const DB_CLIENT = new InfluxDB({
    url: ENV.INFLUX.HOST,
    token: ENV.INFLUX.TOKEN,
});
const DB_WRITE_POINT = DB_CLIENT.getWriteApi(ENV.INFLUX.ORG, ENV.INFLUX.BUCKET);
DB_WRITE_POINT.useDefaultTags({ app: "query-param-app" });

// admin route
app.use('/admin',admin_router);

// user route
app.use('/user',user_router);

// Endpoint - Update LED status 
app.get('/api/v1/update-led-status', async (req, res) => {
    const { status } = req.query;

    if (status !== 'on' && status !== 'off') {
        res.status(400).send("Invalid status. Must be 'on' or 'off'.");
        logger.error({ statusCode: 400, message: "Invalid LED status", timestamp: new Date().toISOString() });
        return;
    }

    const numericStatus = status === 'on' ? 1 : 0;        

    try {
        const pointLEDStatus = new Point('led_status')
            .intField('status', numericStatus);  

        DB_WRITE_POINT.writePoint(pointLEDStatus);
        await DB_WRITE_POINT.flush();

        res.send(`LED status ${status}`);
        logger.info({ statusCode: 200, message: `LED status updated to ${status}`, timestamp: new Date().toISOString() });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error writing data to InfluxDB');
        logger.error({ statusCode: 500, message: 'Error writing data to InfluxDB', timestamp: new Date().toISOString(), error: err.message });
    }
});

// Endpoint - Get LED statusss
app.get('/api/v1/get-led-status', async (req, res) => {
    try {
        const query = `
            from(bucket: "${ENV.INFLUX.BUCKET}")
            |> range(start: -30d)
            |> filter(fn: (r) => r._measurement == "led_status")
            |> filter(fn: (r) => r._field == "status")
            |> last()
        `;

        const results = [];
        const DB_READ_API = DB_CLIENT.getQueryApi(ENV.INFLUX.ORG);

        await DB_READ_API.queryRows(query, {
            next(row, tableMeta) {
                const data = tableMeta.toObject(row);
                results.push(data);
            },
            error(error) {
                console.error('Query Error:', error);
                res.status(500).send('Error fetching LED status');
            },
            complete() {
                if (results.length === 0) {
                    res.status(404).send("LED status not found");
                } else {
                    const ledStatus = results[0]._value;
                    res.json({ status: ledStatus === 1 ? 'on' : 'off' });
                }
            },
        });
    } catch (err) {
        console.error('Unexpected Error:', err);
        res.status(500).send('Error fetching LED status');
    }
});



// Endpoint - Record temperature to InfluxDB
app.get('/api/v1/embed-temperature', async (req, res) => {
    const { temperature } = req.query;

    if (!temperature) {
        res.status(400).send("Missing temperature");
        logger.error({ statusCode: 400, message: "Missing temperature", timestamp: new Date().toISOString() });
        return;
    }

    const numeric_temperature = parseFloat(temperature);

    if (isNaN(numeric_temperature)) {
        res.status(400).send("Invalid values.");
        logger.error({ statusCode: 400, message: "Invalid temperature value", timestamp: new Date().toISOString() });
        return;
    }

    try {
        const pointTemperature = new Point("qparams")
            .floatField("temperature", numeric_temperature);

        DB_WRITE_POINT.writePoint(pointTemperature);
        await DB_WRITE_POINT.flush();

        res.send(`Temperature: ${temperature}`);
        logger.info({ statusCode: 200, message: "Temperature recorded and uid recorded", timestamp: new Date().toISOString() });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error writing data to InfluxDB');
        logger.error({ statusCode: 500, message: 'Error writing data to InfluxDB', timestamp: new Date().toISOString(), error: err.message });
    }
});

// Endpoint - Record humidity to InfluxDB
app.get('/api/v1/embed-humidity', async (req, res) => {
    const { humidity} = req.query;

    if (!humidity) {
        res.status(400).send("Missing humidity");
        logger.error({ statusCode: 400, message: "Missing humidity", timestamp: new Date().toISOString() });
        return;
    }


    const numeric_humidity = parseFloat(humidity);

    if (isNaN(numeric_humidity)) {
        res.status(400).send("Invalid values.");
        logger.error({ statusCode: 400, message: "Invalid humidity value", timestamp: new Date().toISOString() });
        return;
    }

    try {
        const pointHumidity = new Point("qparams")
            .floatField("humidity", numeric_humidity);

        DB_WRITE_POINT.writePoint(pointHumidity);
        await DB_WRITE_POINT.flush();

        res.send(`Humidity: ${humidity}`);
        logger.info({ statusCode: 200, message: "Humidity recorded", timestamp: new Date().toISOString() });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error writing data to InfluxDB');
        logger.error({ statusCode: 500, message: 'Error writing data to InfluxDB', timestamp: new Date().toISOString(), error: err.message });
    }
});

// Endpoint - Get Temperature from InfluxDB
app.get('/api/v1/get-tem', async (req, res) => {


    const query = `
        from(bucket: "${ENV.INFLUX.BUCKET}")
        |> range(start: -30d)
        |> filter(fn: (r) => r._measurement == "qparams")
        |> filter(fn: (r) => r._field == "temperature")
    `;

    try {
        const results = {};
        const DB_READ_API = DB_CLIENT.getQueryApi(ENV.INFLUX.ORG);

        await DB_READ_API.queryRows(query, {
            next(row, tableMeta) {
                const data = tableMeta.toObject(row);
                const time = data._time;

                if (!results[time]) {
                    results[time] = { time };
                }

                results[time][data._field] = data._value;
            },
            error(error) {
                console.error('Error during query:', error);
                res.status(500).send('Error fetching data from InfluxDB');
                logger.error({ statusCode: 500, message: 'Error fetching data from InfluxDB', timestamp: new Date().toISOString(), error: error.message });
            },
            complete() {
                const formattedResults = Object.values(results);
                if (formattedResults.length === 0) {
                    res.status(404).send('No data found');
                    logger.info({ statusCode: 404, message: 'No temperature data found', timestamp: new Date().toISOString() });
                } else {
                    res.json(formattedResults);
                    logger.info({ statusCode: 200, message: 'Temperature data fetched successfully', timestamp: new Date().toISOString() });
                }
            },
        });
    } catch (err) {
        console.error('Error in /get-tem route:', err);
        res.status(500).send('Error fetching data from InfluxDB');
        logger.error({ statusCode: 500, message: 'Error fetching data from InfluxDB', timestamp: new Date().toISOString(), error: err.message });
    }
});

// Endpoint - Get Humidity from InfluxDB
app.get('/api/v1/get-hum', async (req, res) => {

    const query = `
        from(bucket: "${ENV.INFLUX.BUCKET}")
        |> range(start: -30d)
        |> filter(fn: (r) => r._measurement == "qparams")
        |> filter(fn: (r) => r._field == "humidity")
    `;

    try {
        const results = {};
        const DB_READ_API = DB_CLIENT.getQueryApi(ENV.INFLUX.ORG);

        await DB_READ_API.queryRows(query, {
            next(row, tableMeta) {
                const data = tableMeta.toObject(row);
                const time = data._time;

                if (!results[time]) {
                    results[time] = { time };
                }

                results[time][data._field] = data._value;
            },
            error(error) {
                console.error('Error during query:', error);
                res.status(500).send('Error fetching data from InfluxDB');
                logger.error({ statusCode: 500, message: 'Error fetching data from InfluxDB', timestamp: new Date().toISOString(), error: error.message });
            },
            complete() {
                const formattedResults = Object.values(results);
                if (formattedResults.length === 0) {
                    res.status(404).send('No data found');
                    logger.info({ statusCode: 404, message: 'No humidity data found', timestamp: new Date().toISOString() });
                } else {
                    res.json(formattedResults);
                    logger.info({ statusCode: 200, message: 'Humidity data fetched successfully', timestamp: new Date().toISOString() });
                }
            },
        });
    } catch (err) {
        console.error('Error in /get-hum route:', err);
        res.status(500).send('Error fetching data from InfluxDB');
        logger.error({ statusCode: 500, message: 'Error fetching data from InfluxDB', timestamp: new Date().toISOString(), error: err.message });
    }
});

app.get('/api/v1/logs', (req, res) => {
    const logEntries = [];
    try {
        const data = fs.readFileSync('app.log', 'utf8');
        logEntries.push(...data.split('\n'));
        res.send(logEntries);
    } catch (err) {
        console.error('Error reading log file:', err);
        res.status(500).send('Error retrieving logs');
        logger.error({ statusCode: 500, message: 'Error retrieving logs', timestamp: new Date().toISOString(), error: err.message });
    }
});

// 2. Start server
app.listen(ENV.PORT, ENV.HOST, () => {
    console.log(`Listening at http://${ENV.HOST}:${ENV.PORT}`);
});
