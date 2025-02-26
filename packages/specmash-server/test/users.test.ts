const request = require('supertest')
const app = require('../server')

describe('Тестирование пользователей', () => {
  let token

  beforeAll(async () => {
    // получаем токен
  })

  describe('GET /users', () => {
    it('должен вернуть список пользователей', async () => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(200)
      expect(Array.isArray(response.body)).toBeTruthy()
    })
  })

  describe('POST /users', () => {
    it('должен добавить нового пользователя', async () => {
      const user = {
        name: 'Test User'
      }

      const response = await request(app).post('/users').send(user)

      expect(response.statusCode).toBe(201)
    })
  })

  describe('PUT /users/:id', () => {
    it('должен обновить пользователя', async () => {
      const user = {
        id: 1,
        name: 'Updated User'
      }

      const response = await request(app).put('/users/1').send(user)

      expect(response.statusCode).toBe(200)
    })
  })

  describe('DELETE /users/:id', () => {
    it('должен удалить пользователя', async () => {
      const response = await request(app).delete('/users/1')

      expect(response.statusCode).toBe(200)
    })
  })
})
