import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import "dotenv/config.js";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Realtime Chat App API",
      version: "1.0.0",
      description: "API documentation for the Realtime Chat Application",
      contact: {
        name: "API Support",
        email: "support@realtimechatapp.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["src/docs/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
export { swaggerUi, swaggerDocs };
