import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import cors from '@fastify/cors'

const prisma = new PrismaClient()
const app = fastify()

app.register(cors)

app.get("/tasks", async function (request, response) {
  const tasks = await prisma.task.findMany()

  response.send(tasks)
})

app.get("/tasks/pending", async function (request, response) {
  const tasks = await prisma.task.findMany({
    where: {
      completed: false
    }
  })

  response.send(tasks)
})

app.get("/tasks/completed", async function (request, response) {
  console.log('dsnadjnasjkdaksjdn')

  const tasks = await prisma.task.findMany({
    where: {
      completed: true
    }
  })

  response.send(tasks)
})

app.post("/tasks", async function (request, response) {
  const body = request.body

  const name = body.name

  const newTask = await prisma.task.create({
    data: {
      name: name
    }
  })

  response.status(201).send(newTask)
})

app.delete("/tasks/:id", async function (request, response) {
  const params = request.params

  const id = parseInt(params.id)

  await prisma.task.delete({ where: { id: id }})

  return response.status(204).send()
})

app.patch("/tasks/:id/completed", async function (request, response) {
  const params = request.params
  const id = parseInt(params.id)

  const task = await prisma.task.findUnique({
    where: { id: id }
  })

  const isCompleted = task.completed

  const updatedTask = await prisma.task.update({
    where: { id: id },
    data: {
      completed: !isCompleted
    }
  })

  response.status(202).send(updatedTask)
})



app.listen({ port: 3333 })
.then(() => console.log('HTTP server is running'))
.catch(() => console.log('Error'))
