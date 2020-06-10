const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("api is running"));

app.listen(PORT, () => {
  console.log(`SERVER STARTED ON PORT ${PORT}`);
});
