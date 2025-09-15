import { fastifyCors } from "@fastify/cors"
import fastifyMultipart from "@fastify/multipart"
import fastifySwagger from "@fastify/swagger"
import { fastifySwaggerUi } from "@fastify/swagger-ui"
import { fastify } from "fastify"
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod"
import { xptoRoute } from "./routes/xpto"

const server = fastify()

// Configs
server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)
server.register(fastifyCors, { origin: "*" })
server.register(fastifyMultipart)

server.setErrorHandler((error, _, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: "Validation error",
      issues: error.cause,
    })
  }

  // Aqui nesse ponto entra as ferramentas de monitoramento e observabilidade
  // Como Sentry, DataDog, NewRelic, etc.

  console.error(error)

  return reply.status(500).send({
    message: "Internal server error",
  })
})

// Swagger
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Upload Server",
      version: "1.0.0",
    },
  },
})
server.register(fastifySwaggerUi, {
  routePrefix: "/docs",
})

// Routes
server.register(xptoRoute)

server.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.info("HTTP server running!")
})
