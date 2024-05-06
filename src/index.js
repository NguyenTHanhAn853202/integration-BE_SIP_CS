const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const router = require("./router/index.routes");
const { connect } = require("./connection");
const socket = require("./socket");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const port = 9098;

// connectDB
connect();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

//middleware
app.use(cors());
app.use(morgan("combined"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router(app);

socket(io);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
