import express from 'express';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import cors from 'cors';
import { getEnvs } from './envs.mjs';

// 1. Initialize
const ENV = getEnvs();
console.log({ENV});
const app = express();
app.use(cors()); // cho pheps mấy cái dm khác connect cái API NàyNày

// 2.2. Initialise DB connection
const DB_CLIENT = new InfluxDB({
    url: ENV.INFLUX.HOST,
    token: ENV.INFLUX.TOKEN,
});
const DB_WRITE_POINT = DB_CLIENT.getWriteApi(ENV.INFLUX.ORG, ENV.INFLUX.BUCKET);
DB_WRITE_POINT.useDefaultTags({ app: "query-param-app" });


// Check InfluxDB connection
app.get('/api/v1/', (_, res) => res.sendStatus(200));

// Endpoint - Record tem and hum to InfluxDB
// Method đang GET có thời gian sửa lại thành Post sau (đã cố nhưng chạy lỗi)
app.get('/api/v1/embed', async (req, res) => {
    const { temperature, humidity } = req.query;

    if (!temperature || !humidity) {
        return res.status(400).send("Missing temperature or humidity");
    }

    const numeric_temperature = parseFloat(temperature);
    const numeric_humidity = parseFloat(humidity);

    if (isNaN(numeric_temperature) || isNaN(numeric_humidity)) {
        return res.status(400).send("Invalid values.");
    }

    try {
        const pointTemperatureHumidity = new Point("qparams")
            .floatField("temperature", numeric_temperature)
            .floatField("humidity", numeric_humidity);
            // Đang ghi ở Float.

        DB_WRITE_POINT.writePoint(pointTemperatureHumidity);
        await DB_WRITE_POINT.flush();

        res.send(`Temperature: ${temperature}, Humidity: ${humidity} written.`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error writing data to InfluxDB');
    }
});

// Endpoint - Get Tem & Hum from InfluxDB at the same time.
// dạng json nó chỉ trả lại tem,hum với time mấy fields khác bỏ hết
app.get('/api/v1/get-tem-hum', async (req, res) => {
    const query = `
        from(bucket: "${ENV.INFLUX.BUCKET}")
        |> range(start: -30d)
        |> filter(fn: (r) => r._measurement == "qparams")
        |> filter(fn: (r) => r._field == "temperature" or r._field == "humidity")
    `;
// 30 days chỉnh sau cx đcđc
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
            },
            complete() {
                const formattedResults = Object.values(results);
                if (formattedResults.length === 0) {
                    res.status(404).send('No data found');
                } else {
                    res.json(formattedResults);
                }
            },
        });
    } catch (err) {
        console.error('Error in /get-data route:', err);
        res.status(500).send('Error fetching data from InfluxDB');
    }
});

// Endpoint - record frequency to InfluxDB
// Endpoint này tách riêng với cái embed ở trên ra vì thời điểm ghi cái frequency và mấy cái tem,hum là khác nhau
// đang là GET như cái embed ở trên, muốn sửa thành post nhưng fail không chạy. Nếu có thời gian thì sửa sau ko thì GET cx đc, hơi lủng xíu. 
app.get('/api/v1/key', async (req, res) => {
    const { frequency } = req.query;

    if (!frequency) {
        return res.status(400).send("Missing query parameter 'frequency'");
    }

    const numeric_frequency = parseFloat(frequency);

    if (isNaN(numeric_frequency)) {
        return res.status(400).send("Invalid value. Please provide a numeric value for 'frequency'.");       
    }

    try {
        const pointFrequency = new Point("qparams")
            .floatField("frequency", numeric_frequency);
            // Đang ghi ở Float. longField có thể consider, này tùy vào Dũng.

        DB_WRITE_POINT.writePoint(pointFrequency);
        await DB_WRITE_POINT.flush();

        res.send(`Frequency: ${frequency} written.`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error writing data to InfluxDB');
    }
});


// Endpoint - Fetch frequency data
app.get('/api/v1/get-frequency', async (req, res) => {
    const query = `
        from(bucket: "${ENV.INFLUX.BUCKET}")
        |> range(start: -30d)
        |> filter(fn: (r) => r._measurement == "qparams")
        |> filter(fn: (r) => r._field == "frequency")
    `;
// fetch frequency wwithin the last 30 days (cái này đổi sau cx đc nhưng 30d là lý tưởng nhất)
    try {
        const results = [];
        const DB_READ_API = DB_CLIENT.getQueryApi(ENV.INFLUX.ORG);

        await DB_READ_API.queryRows(query, {
            next(row, tableMeta) {
                const data = tableMeta.toObject(row);
                results.push(data);
            },
            error(error) {
                console.error('Error during query:', error);
                res.status(500).send('Error fetching data from InfluxDB');
            },
            complete() {
                if (results.length === 0) {
                    res.status(404).send('No data found');
                } else {
                    res.json(results);
                }
            },
        });
    } catch (err) {
        console.error('Error in /get-frequency route:', err);
        res.status(500).send('Error fetching data from InfluxDB');
    }
});

// Endpoint - base
app.get('/', (_, res) => res.send('OK'));

// Endpoint - test query params
app.get('/test', (req, res) => {
    console.log(req.query);
    res.send('Received query params!');
});

// 2. Start server
app.listen(ENV.PORT, ENV.HOST, () => {
    console.log(`Listening at http://${ENV.HOST}:${ENV.PORT}`);
});