import type { NextApiRequest, NextApiResponse } from 'next'

type HealthData = {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  uptime: number
  services: {
    database: 'connected' | 'disconnected'
    cache: 'connected' | 'disconnected'
  }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthData>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
    return
  }

  const healthData: HealthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
    services: {
      database: 'connected', // In production, check actual database connection
      cache: 'connected'
    }
  }

  res.status(200).json(healthData)
}