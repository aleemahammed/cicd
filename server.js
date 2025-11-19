const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from CI/CD Pipeline Deployment! this is done by Loka Nehan Reddy 22011102044✅");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
