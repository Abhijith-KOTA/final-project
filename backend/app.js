const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const moment = require('moment-timezone');
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
const dbpath = path.join(__dirname, "airPollution.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    const port = 3001
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}/`);
    });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};

initializeDBAndServer();

app.put("/createtable",async (request, response) => {
  const createTableQuery = `CREATE TABLE air_quality (
    time TIMESTAMP PRIMARY KEY,
    pm2_5 REAL,
    CO REAL,
    NH3 REAL,
    Ozone REAL,
    humidity REAL,
    Temperature REAL
)`;
await db.run(createTableQuery)
.then(() => {
	response.status(200);
  response.send("Table created successfully");
})
})


app.post("/insertdata", async (request, response) => {
  const { pm2_5, CO, NH3, Ozone, humidity, Temperature } = request.body;
  const currentTimeIST = moment.tz(moment(), 'Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
  const insertQuery = `
      INSERT INTO air_quality (time, pm2_5, CO, NH3, Ozone, humidity, Temperature) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  await db.run(insertQuery, [currentTimeIST, pm2_5, CO, NH3, Ozone, humidity, Temperature])
      .then(() => {
          response.status(200).send("Data Inserted");
          console.log("done")
      })
      .catch((error) => {
          console.log(error);
          response.status(500).send("Error inserting data");
      });
});

app.put("/clear", async (request, response) => {
  const clearQuery = `DELETE FROM air_quality;`;
  await db.run(clearQuery).then(() => {
  response.status(200);
  response.send("Cleared");}
  ).catch((error) => {
    console.log(error);
    response.status(500).send("Error clearing data");
  });
})

app.get("/getdata", async (request, response) => {
	const getDataQuery = `SELECT * FROM air_quality;`;
	const data = await db.all(getDataQuery);
	response.status(200);
	response.send(data);
})

app.get("/checkColumnType", async (request, response) => {
  const query = `
      PRAGMA table_info(air_quality);
  `;
  try {
      const result = await db.all(query);
      // Iterate through the result to find the data type of each column
      const columnTypes = result.map(column => ({ name: column.name, type: column.type }));
      response.status(200).json(columnTypes);
  } catch (error) {
      console.error("Error executing query:", error);
      response.status(500).json({ error: "Internal server error" });
  }
});


app.get("/tableinfo", async(request, response) =>{
  const infoQuery = `PRAGMA table_info(air_quality);`
  const info = await db.all(infoQuery);
  response.status(200);
  response.send(info);
})

app.get("/hoursdata", async (request, response) =>{
  const query = `
  SELECT 
        strftime('%Y-%m-%d %H:00:00', time) AS hour,
        strftime('%Y-%m-%d', time) AS date,
        strftime('%Y-%m', time) AS month,
        strftime('%Y', time) AS year,
        AVG(pm2_5) AS pm2_5_hourly_average,
        AVG(CO) AS CO_hourly_average,
        AVG(NH3) AS NH3_hourly_average,
        AVG(Ozone) AS Ozone_hourly_average,
        AVG(humidity) AS humidity_hourly_average,
        AVG(Temperature) AS Temperature_hourly_average
      FROM 
      air_quality
      GROUP BY 
        hour, date, month, year;`
  
  const hoursData = await db.all(query);
  response.status(200);
  response.send(hoursData);
})

app.get("/dailystats", async (request, response) => {
  const lastRowQuery = `
        SELECT MAX(time) AS last_time FROM air_quality;
    `;
    const { last_time } = await db.get(lastRowQuery);
  const query = `
        SELECT
            AVG(pm2_5) AS avg_pm2_5,
            MIN(pm2_5) AS min_pm2_5,
            MAX(pm2_5) AS max_pm2_5,
            AVG(CO) AS avg_CO,
            MIN(CO) AS min_CO,
            MAX(CO) AS max_CO,
            AVG(NH3) AS avg_NH3,
            MIN(NH3) AS min_NH3,
            MAX(NH3) AS max_NH3,
            AVG(Ozone) AS avg_Ozone,
            MIN(Ozone) AS min_Ozone,
            MAX(Ozone) AS max_Ozone,
            AVG(humidity) AS avg_humidity,
            MIN(humidity) AS min_humidity,
            MAX(humidity) AS max_humidity,
            AVG(Temperature) AS avg_Temperature,
            MIN(Temperature) AS min_Temperature,
            MAX(Temperature) AS max_Temperature
        FROM
            air_quality
        WHERE
            DATE(time) = DATE(?)
    `;
    try {
      const dailystatsdata = await db.get(query, [last_time]);
      response.status(200).json(dailystatsdata);
  } catch (error) {
      console.error("Error executing query:", error);
      response.status(500).json({ error: "Internal server error" });
  }

})

app.get("/checkCurrentDateRecords", async (request, response) => {
  const query = `
      SELECT COUNT(*) AS count FROM air_quality WHERE DATE(time) = DATE('now');
  `;
  try {
      const result = await db.get(query);
      response.status(200).json({ count: result.count });
  } catch (error) {
      console.error("Error executing query:", error);
      response.status(500).json({ error: "Internal server error" });
  }
});

app.get('/getPM25', async (request, response) => {
  const query = `
        SELECT
            DATETIME(time) as time_stamp, pm2_5
        FROM
            air_quality
        ORDER BY
        time_stamp;
    `;
    const pm2_5data = await db.all(query);
    response.status(200);
    response.send(pm2_5data);
})

app.get('/getco', async (request, response) => {
  const query = `
        SELECT
            DATETIME(time) as time_stamp, CO
        FROM
            air_quality
        ORDER BY
        time_stamp;
    `;
    const codata = await db.all(query);
    response.status(200);
    response.send(codata);
})

app.get('/getnh3', async (request, response) => {
  const query = `
        SELECT
            DATETIME(time) as time_stamp, NH3
        FROM
            air_quality
        ORDER BY
        time_stamp;
    `;
    const nh3data = await db.all(query);
    response.status(200);
    response.send(nh3data);
})

app.get('/getozone', async (request, response) => {
  const query = `
        SELECT
            DATETIME(time) as time_stamp, Ozone
        FROM
            air_quality
        ORDER BY
        time_stamp;
    `;
    const ozonedata = await db.all(query);
    response.status(200);
    response.send(ozonedata);
})

app.get('/gethumidity', async (request, response) => {
  const query = `
        SELECT
            DATETIME(time) as time_stamp, humidity
        FROM
            air_quality
        ORDER BY
        time_stamp;
    `;
    const humiditydata = await db.all(query);
    response.status(200);
    response.send(humiditydata);
})

app.get('/gettemperature', async (request, response) => {
  const query = `
        SELECT
            DATETIME(time) as time_stamp, Temperature
        FROM
            air_quality
        ORDER BY
        time_stamp;
    `;
    const Temperaturedata = await db.all(query);
    response.status(200);
    response.send(Temperaturedata);
})

module.exports = app;
