import type { NextApiRequest, NextApiResponse } from 'next'

interface AthleteResult {
  athleteId: string
  name: string
  level: number
  eliminatedAt?: number
  warnings: number
  isEliminated: boolean
  sessionId: string
}

// In-memory storage for development
const athleteResults: AthleteResult[] = []

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  switch (method) {
    case 'GET':
      // Get athlete results
      const { sessionId: querySessionId } = req.query
      
      if (querySessionId) {
        const results = athleteResults.filter(a => a.sessionId === querySessionId)
        res.status(200).json(results)
      } else {
        res.status(200).json(athleteResults)
      }
      break

    case 'POST':
      // Add athlete result
      const { athleteId, name, level, sessionId } = req.body
      
      if (!athleteId || !name || !sessionId) {
        res.status(400).json({ error: 'athleteId, name, and sessionId are required' })
        return
      }

      const newResult: AthleteResult = {
        athleteId,
        name,
        level: level || 1,
        warnings: 0,
        isEliminated: false,
        sessionId
      }

      athleteResults.push(newResult)
      res.status(201).json(newResult)
      break

    case 'PUT':
      // Update athlete result
      const { athleteId: updateId, sessionId: updateSessionId, ...updateData } = req.body
      
      const resultIndex = athleteResults.findIndex(
        a => a.athleteId === updateId && a.sessionId === updateSessionId
      )
      
      if (resultIndex === -1) {
        res.status(404).json({ error: 'Athlete result not found' })
        return
      }

      athleteResults[resultIndex] = { 
        ...athleteResults[resultIndex], 
        ...updateData 
      }
      
      res.status(200).json(athleteResults[resultIndex])
      break

    case 'DELETE':
      // Delete athlete result
      const { athleteId: deleteId, sessionId: deleteSessionId } = req.query
      
      const deleteIndex = athleteResults.findIndex(
        a => a.athleteId === deleteId && a.sessionId === deleteSessionId
      )
      
      if (deleteIndex === -1) {
        res.status(404).json({ error: 'Athlete result not found' })
        return
      }

      athleteResults.splice(deleteIndex, 1)
      res.status(204).end()
      break

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}