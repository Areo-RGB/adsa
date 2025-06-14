// YoYo Test Schedule Data and Types
export interface YoyoScheduleItem {
  leg: number | null
  level: number | null
  speed_kmh: number | null
  total_time_seconds: number
  total_time_formatted: string
  total_distance_m: number
  action: 'start' | 'out' | 'back' | 'recovery'
  is_recovery: boolean
}

export interface Athlete {
  id: string
  name: string
  currentLevel: number
  isEliminated: boolean
  eliminatedAt?: number
  warnings: number
}

export interface TestSession {
  name: string
  athletes: Record<string, Athlete>
  rankings: string[]
  sessionId: string | null
  testDate: Date | null
}

export const yoyoScheduleData: YoyoScheduleItem[] = [
  { leg: 0, level: null, speed_kmh: null, total_time_seconds: 0.0, total_time_formatted: '00:00.0', total_distance_m: 0, action: 'start', is_recovery: false },
  { leg: 1, level: 5, speed_kmh: 10.0, total_time_seconds: 7.2, total_time_formatted: '00:07.2', total_distance_m: 20, action: 'out', is_recovery: false },
  { leg: 2, level: 5, speed_kmh: 10.0, total_time_seconds: 14.4, total_time_formatted: '00:14.4', total_distance_m: 40, action: 'back', is_recovery: false },
  { leg: null, level: null, speed_kmh: null, total_time_seconds: 24.4, total_time_formatted: '00:24.4', total_distance_m: 40, action: 'recovery', is_recovery: true },
  // ... (truncated for brevity - the full schedule would be included)
]

export class YoyoTestTimer {
  private startTime: number | null = null
  private pausedTime: number = 0
  private isPaused: boolean = false
  private currentEventIndex: number = 0
  private timerInterval: NodeJS.Timeout | null = null
  private callbacks: {
    onTick?: (currentTime: number, nextEvent: YoyoScheduleItem | null) => void
    onEvent?: (event: YoyoScheduleItem) => void
    onComplete?: () => void
  } = {}

  constructor(callbacks: typeof this.callbacks = {}) {
    this.callbacks = callbacks
  }

  start() {
    if (this.isPaused) {
      // Resume from pause
      this.startTime = Date.now() - this.pausedTime
      this.isPaused = false
    } else {
      // Fresh start
      this.startTime = Date.now()
      this.currentEventIndex = 0
    }

    this.timerInterval = setInterval(() => {
      this.tick()
    }, 100) // Update every 100ms for smooth timer
  }

  pause() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }
    
    if (this.startTime) {
      this.pausedTime = Date.now() - this.startTime
      this.isPaused = true
    }
  }

  stop() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }
    
    this.startTime = null
    this.pausedTime = 0
    this.isPaused = false
    this.currentEventIndex = 0
  }

  private tick() {
    if (!this.startTime) return

    const currentTime = (Date.now() - this.startTime) / 1000 // Convert to seconds
    const nextEvent = yoyoScheduleData[this.currentEventIndex]

    // Check if we've reached the next event
    if (nextEvent && currentTime >= nextEvent.total_time_seconds) {
      this.callbacks.onEvent?.(nextEvent)
      this.currentEventIndex++
      
      // Check if test is complete
      if (this.currentEventIndex >= yoyoScheduleData.length) {
        this.callbacks.onComplete?.()
        this.stop()
        return
      }
    }

    const upcomingEvent = yoyoScheduleData[this.currentEventIndex]
    this.callbacks.onTick?.(currentTime, upcomingEvent)
  }

  getCurrentTime(): number {
    if (!this.startTime) return 0
    if (this.isPaused) return this.pausedTime / 1000
    return (Date.now() - this.startTime) / 1000
  }

  isRunning(): boolean {
    return this.timerInterval !== null && !this.isPaused
  }
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toFixed(1).padStart(4, '0')}`
}

export function calculateYoyoLevel(timeElapsed: number): number {
  // Find the current level based on elapsed time
  const currentEvent = yoyoScheduleData
    .filter(item => !item.is_recovery && item.level !== null)
    .find(item => timeElapsed < item.total_time_seconds)
  
  return currentEvent?.level || 1
}