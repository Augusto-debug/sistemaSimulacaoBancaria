import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import { server } from './mocks/server'

// Estabelecer API mocking antes de todos os testes
beforeAll(() => server.listen())

// Reset qualquer handler que possamos adicionar durante os testes,
// para que eles não afetem outros testes
afterEach(() => {
  server.resetHandlers()
  cleanup()
})

// Limpar depois que os testes terminarem
afterAll(() => server.close()) 