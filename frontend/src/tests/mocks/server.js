import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// Configura o servidor de mock com os handlers
export const server = setupServer(...handlers) 