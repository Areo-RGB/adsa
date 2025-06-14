import type { NextApiRequest, NextApiResponse } from 'next'

interface Athlete {
  id: string
  name: string
  currentLevel: number
  isEliminated: boolean
  warnings: number
}

interface YoyoSession {
  id: string
  name: string
  testDate: string
  athletes: Athlete[]
  status: 'active' | 'completed' | 'paused'
}

// In-memory storage for development (replace with database in production)
const sessions: YoyoSession[] = []

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  switch (method) {
    case 'GET':
      // Get all sessions
      res.status(200).json(sessions)
      break

    case 'POST':
      // Create new session
      const { name, athletes } = req.body
      
      if (!name || !Array.isArray(athletes)) {
        res.status(400).json({ error: 'Name and athletes array are required' })
        return
      }

      const newSession: YoyoSession = {
        id: Date.now().toString(),
        name,
        testDate: new Date().toISOString(),
        athletes,
        status: 'active'
      }

      sessions.push(newSession)
      res.status(201).json(newSession)
      break

    case 'PUT':
      // Update session
      const { id, ...updateData } = req.body
      
      const sessionIndex = sessions.findIndex(s => s.id === id)
      if (sessionIndex === -1) {
        res.status(404).json({ error: 'Session not found' })
        return
      }

      sessions[sessionIndex] = { ...sessions[sessionIndex], ...updateData }
      res.status(200).json(sessions[sessionIndex])
      break

    case 'DELETE':
      // Delete session
      const { id: deleteId } = req.query
      
      const deleteIndex = sessions.findIndex(s => s.id === deleteId)
      if (deleteIndex === -1) {
        res.status(404).json({ error: 'Session not found' })
        return
      }

      sessions.splice(deleteIndex, 1)
      res.status(204).end()
      break

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}