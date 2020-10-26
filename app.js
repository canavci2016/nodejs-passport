const express = require("express");
const Server = require("./server");
const app = express();

new Server(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on ${PORT}`));