const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>CI/CD Deployment by aleem</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: linear-gradient(to right, #00c6ff, #0072ff);
            text-align: center;
            padding: 100px;
            color: white;
          }
          h1 {
            font-size: 40px;
            margin-bottom: 20px;
          }
          p {
            font-size: 22px;
            font-weight: 300;
          }
          .card {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            padding: 30px;
            backdrop-filter: blur(10px);
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🚀 CI/CD Pipeline Deployment Successful!</h1>
          <p>Hello from CI/CD Pipeline.</p>
          <p><strong>Developed & Deployed by:</strong></p>
          <p style="font-size: 25px;"><b>Aleem Ahammed</b><br>22011102094 | IoT-B</p>
        </div>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
