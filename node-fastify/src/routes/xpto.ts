import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"

export const xptoRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    "/xpto",
    {
      schema: {
        summary: "Teste",
        tags: ["xpto"],
        response: {
          200: z.string(),
        },
      },
    },
    async (_request, reply) => {
      return reply.status(200).send("ok")
    }
  )
}
