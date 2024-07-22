const express = require("express");
const app = express();
const http = require("http");
const path = require("path");

const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("send-location", (data) => {
    io.emit("recieve-location", { id: socket.id, ...data });
  });
  console.log("connected");
});

app.get("/", (req, res) => {
  res.render("index");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

server.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
