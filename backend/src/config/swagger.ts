
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "ProofDesk API",
      version: "1.0.0",
      description:
        "API documentation for ProofDesk - AI Trust and Verification Platform",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],
  },
  apis: [
    process.env.NODE_ENV === "production"
      ? "./dist/routes/**/*.js"
      : "./src/routes/**/*.ts",
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
