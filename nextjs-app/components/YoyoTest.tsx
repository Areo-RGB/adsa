import { useState, useEffect, useCallback } from 'react'
import { YoyoTestTimer, formatTime, type Athlete, type TestSession, type YoyoScheduleItem } from '@/utils/yoyoTest'
import { useAudio } from '@/hooks/useAudio'
import { useToast } from '@/hooks/useToast'
import { useApi } from '@/hooks/useApi'

export default function YoyoTest() {
  const [session, setSession] = useState<TestSession>({
    name: '',
    athletes: {},
    rankings: [],
    sessionId: null,
    testDate: null
  })
  
  const [timer, setTimer] = useState<YoyoTestTimer | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [nextEvent, setNextEvent] = useState<YoyoScheduleItem | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [newAthleteName, setNewAthleteName] = useState('')

  const { playBeep } = useAudio()
  const { showToast } = useToast()
  const api = useApi()

  const handleTestEvent = useCallback((event: YoyoScheduleItem) => {
    // Play different sounds for different events
    switch (event.action) {
      case 'start':
        playBeep(800, 300)
        showToast({ title: 'Test Started', message: 'YoYo test has begun!', type: 'info' })
        break
      case 'out':
        playBeep(1000, 200)
        break
      case 'back':
        playBeep(1200, 200)
        break
      case 'recovery':
        playBeep(600, 400)
        break
    }
  }, [playBeep, showToast])

  const handleTestComplete = useCallback(async () => {
    setIsRunning(false)
    
    // Save session to API
    try {
      await api.post('/api/yoyo/sessions', {
        ...session,
        status: 'completed'
      })
      
      showToast({ 
        title: 'Test Complete', 
        message: 'YoYo test has finished and saved!', 
        type: 'success' 
      })
    } catch {
      showToast({ 
        title: 'Save Failed', 
        message: 'Test completed but could not save to server', 
        type: 'warning' 
      })
    }
  }, [showToast, api, session])

  // Initialize timer
  useEffect(() => {
    const timerInstance = new YoyoTestTimer({
      onTick: (time, upcoming) => {
        setCurrentTime(time)
        setNextEvent(upcoming)
      },
      onEvent: (event) => {
        handleTestEvent(event)
      },
      onComplete: () => {
        handleTestComplete()
      }
    })
    
    setTimer(timerInstance)
    
    return () => {
      timerInstance.stop()
    }
  }, [handleTestEvent, handleTestComplete])

  const startTest = async () => {
    if (Object.keys(session.athletes).length === 0) {
      showToast({ 
        title: 'No Athletes', 
        message: 'Please add at least one athlete before starting the test.', 
        type: 'warning' 
      })
      return
    }

    try {
      // Create session in API
      const newSession = await api.post('/api/yoyo/sessions', {
        name: session.name || 'YoYo Test ' + new Date().toLocaleDateString(),
        athletes: Object.values(session.athletes),
        status: 'active'
      })

      timer?.start()
      setIsRunning(true)
      setSession(prev => ({ 
        ...prev, 
        sessionId: newSession.id,
        testDate: new Date() 
      }))
      
      showToast({ 
        title: 'Test Started', 
        message: 'YoYo test session created and started!', 
        type: 'success' 
      })
    } catch {
      showToast({ 
        title: 'Start Failed', 
        message: 'Could not start test session', 
        type: 'error' 
      })
    }
  }

  const pauseTest = () => {
    timer?.pause()
    setIsRunning(false)
  }

  const stopTest = () => {
    timer?.stop()
    setIsRunning(false)
    setCurrentTime(0)
    setNextEvent(null)
  }

  const addAthlete = () => {
    if (!newAthleteName.trim()) {
      showToast({ 
        title: 'Invalid Name', 
        message: 'Please enter a valid athlete name.', 
        type: 'warning' 
      })
      return
    }

    const athleteId = Date.now().toString()
    const newAthlete: Athlete = {
      id: athleteId,
      name: newAthleteName.trim(),
      currentLevel: 1,
      isEliminated: false,
      warnings: 0
    }

    setSession(prev => ({
      ...prev,
      athletes: { ...prev.athletes, [athleteId]: newAthlete }
    }))
    
    setNewAthleteName('')
    showToast({ 
      title: 'Athlete Added', 
      message: `${newAthlete.name} has been added to the test.`, 
      type: 'success' 
    })
  }

  const eliminateAthlete = (athleteId: string) => {
    setSession(prev => ({
      ...prev,
      athletes: {
        ...prev.athletes,
        [athleteId]: {
          ...prev.athletes[athleteId],
          isEliminated: true,
          eliminatedAt: currentTime
        }
      }
    }))
  }

  const warnAthlete = (athleteId: string) => {
    setSession(prev => {
      const athlete = prev.athletes[athleteId]
      const newWarnings = athlete.warnings + 1
      
      return {
        ...prev,
        athletes: {
          ...prev.athletes,
          [athleteId]: {
            ...athlete,
            warnings: newWarnings,
            isEliminated: newWarnings >= 2 ? true : athlete.isEliminated,
            eliminatedAt: newWarnings >= 2 ? currentTime : athlete.eliminatedAt
          }
        }
      }
    })
  }

  const removeAthlete = (athleteId: string) => {
    setSession(prev => {
      const newAthletes = { ...prev.athletes }
      delete newAthletes[athleteId]
      return { ...prev, athletes: newAthletes }
    })
  }

  return (
    <div className="container mx-auto p-4">
      <div className="card card-style">
        <div className="content">
          <h2 className="text-2xl font-bold mb-4">YoYo Test</h2>
          
          {/* Timer Display */}
          <div className="bg-highlight rounded-lg p-4 mb-4 text-center">
            <div className="text-white text-3xl font-mono font-bold">
              {formatTime(currentTime)}
            </div>
            {nextEvent && (
              <div className="text-white opacity-80 text-sm mt-2">
                Next: {nextEvent.action} {nextEvent.level && `(Level ${nextEvent.level})`}
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex gap-2 mb-4">
            {!isRunning ? (
              <button 
                onClick={startTest}
                className="btn bg-green-dark flex-1"
                disabled={Object.keys(session.athletes).length === 0}
              >
                Start Test
              </button>
            ) : (
              <button 
                onClick={pauseTest}
                className="btn bg-yellow-dark flex-1"
              >
                Pause
              </button>
            )}
            
            <button 
              onClick={stopTest}
              className="btn bg-red-dark flex-1"
              disabled={currentTime === 0}
            >
              Stop
            </button>
          </div>

          {/* Add Athlete */}
          <div className="card card-style mb-4">
            <div className="content">
              <h4 className="font-600 mb-3">Add Athlete</h4>
              <div className="input-style has-borders has-icon input-style-always-active validate-field">
                <input 
                  type="text" 
                  className="form-control validate-name" 
                  id="athleteName"
                  placeholder="Athlete Name"
                  value={newAthleteName}
                  onChange={(e) => setNewAthleteName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addAthlete()}
                />
                <label htmlFor="athleteName" className="color-highlight">Name</label>
                <i className="fa fa-user"></i>
              </div>
              <button 
                onClick={addAthlete}
                className="btn bg-highlight btn-full mt-3"
              >
                Add Athlete
              </button>
            </div>
          </div>

          {/* Athletes List */}
          <div className="card card-style">
            <div className="content">
              <h4 className="font-600 mb-3">Athletes ({Object.keys(session.athletes).length})</h4>
              
              {Object.values(session.athletes).length === 0 ? (
                <p className="text-center opacity-60">No athletes added yet</p>
              ) : (
                <div className="list-group list-custom-small">
                  {Object.values(session.athletes).map((athlete) => (
                    <div 
                      key={athlete.id}
                      className={`d-flex align-items-center p-2 border rounded mb-2 ${
                        athlete.isEliminated ? 'bg-red-light opacity-60' : 'bg-gray-light'
                      }`}
                    >
                      <div className="flex-grow-1">
                        <div className="font-600">{athlete.name}</div>
                        <div className="font-11 opacity-70">
                          Level: {athlete.currentLevel} | Warnings: {athlete.warnings}
                          {athlete.isEliminated && athlete.eliminatedAt && (
                            <span> | Eliminated at {formatTime(athlete.eliminatedAt)}</span>
                          )}
                        </div>
                      </div>
                      
                      {!athlete.isEliminated && (
                        <div className="flex gap-1">
                          <button 
                            onClick={() => warnAthlete(athlete.id)}
                            className="btn btn-xs bg-yellow-dark"
                            disabled={!isRunning}
                          >
                            Warn
                          </button>
                          <button 
                            onClick={() => eliminateAthlete(athlete.id)}
                            className="btn btn-xs bg-red-dark"
                            disabled={!isRunning}
                          >
                            Eliminate
                          </button>
                        </div>
                      )}
                      
                      <button 
                        onClick={() => removeAthlete(athlete.id)}
                        className="btn btn-xs bg-gray-dark ml-2"
                        disabled={isRunning}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}