const express = require("express");
const winston = require("winston");

const app = express();
const port = 8080;

// Logger Configuration
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: "calculator-microservice" },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      level: "info",
    }),
  ],
});

const fs = require("fs");

// Ensure logs directory exists
if (!fs.existsSync("logs")) {
  fs.mkdirSync("logs");
}

app.use(express.json());

// Basic Arithmetic Operations
app.post("/add", (req, res) => handleOperation(req, res, "add"));
app.post("/subtract", (req, res) => handleOperation(req, res, "subtract"));
app.post("/multiply", (req, res) => handleOperation(req, res, "multiply"));
app.post("/divide", (req, res) => handleOperation(req, res, "divide"));

// Advanced Arithmetic Operations
app.post("/exponentiate", (req, res) =>
  handleOperation(req, res, "exponentiate")
);
app.post("/sqrt", (req, res) => handleOperation(req, res, "sqrt"));
app.post("/modulo", (req, res) => handleOperation(req, res, "modulo"));

// GET Operation to List Available Endpoints
app.get("/operations", (req, res) => {
  res.json({
    operations: [
      "add",
      "subtract",
      "multiply",
      "divide",
      "exponentiate",
      "sqrt",
      "modulo",
    ],
  });
});

function handleOperation(req, res, operation) {
  const { num1, num2 } = req.body;
  let result;

  if (isNaN(num1) || (num2 !== undefined && isNaN(num2))) {
    logger.error("Invalid input: num1 and num2 must be numbers");
    return res
      .status(400)
      .json({ error: "Invalid input. num1 and num2 must be numbers." });
  }

  switch (operation) {
    case "add":
      result = num1 + num2;
      break;
    case "subtract":
      result = num1 - num2;
      break;
    case "multiply":
      result = num1 * num2;
      break;
    case "divide":
      if (num2 === 0) {
        logger.error("Division by zero error");
        return res.status(400).json({ error: "Cannot divide by zero." });
      }
      result = num1 / num2;
      break;
    case "exponentiate":
      result = Math.pow(num1, num2);
      break;
    case "sqrt":
      if (num1 < 0) {
        logger.error("Square root of negative number error");
        return res.status(400).json({
          error:
            "Invalid input. Square root cannot be taken for negative numbers.",
        });
      }
      result = Math.sqrt(num1);
      break;
    case "modulo":
      result = num1 % num2;
      break;
    default:
      logger.error("Invalid operation");
      return res.status(400).json({ error: "Invalid operation." });
  }

  logger.info(
    `New ${operation} operation requested: ${num1} ${operation} ${num2}`
  );
  res.json({ operation, num1, num2, result });
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  logger.info(`Server started on port ${port}`);
});
