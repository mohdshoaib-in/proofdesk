console.log("ProofDesk backend is starting...");

import "dotenv/config";
import app from "./app";

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`ProofDesk API running on http://localhost:${PORT}`);
  console.log(`Swagger documentation: http://localhost:${PORT}/api-docs`);
});
