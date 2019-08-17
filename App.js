const express = require("express");
const app = express();
const apiRouter = require("./Router/apiRouter");
const bodyParser = require("body-parser");
const PORT = 5000;
const db = require("./Database");
const config = require("config");
const seedDatabase = require("./seedDatabase");
const auth = require("./Middlewares/authMid");

// if (!config.get("jwtKey")) {
//   console.error("Config Error: jwtKey is not defined.");
//   process.exit(1);
// }

//Force: true basically wipes the local database clean.
//this file is only run once, when the app is started.
db.sync({ force: false }).then(async () => {
  //   seedDatabase(); //Then we are repopulating the wiped database with our original dummy data.

  //Middleware- Body parser is necessary for POST and PUT requests to work
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
  });

  app.use("/api", apiRouter); //init express app
  app.listen(PORT, () => {
    console.log(`Server is running on PORT${PORT}`);
  });
});
