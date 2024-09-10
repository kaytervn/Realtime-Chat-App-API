import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import "dotenv/config.js";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Realtime Chat App API",
      version: "1.0.0",
      servers: [
        {
          url: `http://localhost:${process.env.PORT}`,
        },
      ],
    },
  },
  apis: ["src/docs/*.js"], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
export { swaggerUi, swaggerDocs };
