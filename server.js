const express = require('express');
const path = require('path');
const pool = require('./db');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store active sessions
const sessions = new Map();
let currentSessionId = null;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Save yoyo test result
app.post('/save-result', async (req, res) => {
    try {
        const { athleteName, level, distance, timestamp } = req.body;

        // Create table if it doesn't exist
        await pool.query(`
            CREATE TABLE IF NOT EXISTS yoyo_results (
                id SERIAL PRIMARY KEY,
                athlete_name VARCHAR(255) NOT NULL,
                level INTEGER NOT NULL,
                distance VARCHAR(20) NOT NULL,
                timestamp TIMESTAMP NOT NULL
            )
        `);

        // Insert the result
        await pool.query(
            'INSERT INTO yoyo_results (athlete_name, level, distance, timestamp) VALUES ($1, $2, $3, $4)',
            [athleteName, level, distance, timestamp]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Error saving result:', error);
        res.status(500).json({ error: 'Failed to save result' });
    }
});

// Get all results for an athlete
app.get('/athlete-results/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const results = await pool.query(
            'SELECT * FROM yoyo_results WHERE athlete_name = $1 ORDER BY timestamp DESC',
            [name]
        );
        res.json(results.rows);
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ error: 'Failed to fetch results' });
    }
});

// WebSocket connection handler
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);

        switch(data.type) {
            case 'create_session':
                currentSessionId = Date.now().toString();
                sessions.set(currentSessionId, new Set([ws]));
                ws.sessionId = currentSessionId;
                ws.send(JSON.stringify({
                    type: 'session_created',
                    sessionId: currentSessionId
                }));
                break;

            case 'join_session':
                const session = sessions.get(data.sessionId);
                if (session) {
                    session.add(ws);
                    ws.sessionId = data.sessionId;
                    ws.send(JSON.stringify({
                        type: 'session_joined',
                        sessionId: data.sessionId
                    }));

                    // Broadcast to all clients in the session that a new device joined
                    broadcastToSession(data.sessionId, {
                        type: 'device_joined',
                        timestamp: new Date().toISOString()
                    });
                } else {
                    ws.send(JSON.stringify({
                        type: 'error',
                        message: 'Session not found'
                    }));
                }
                break;

            case 'test_state':
                broadcastToSession(ws.sessionId, {
                    type: 'test_state',
                    ...data
                }, ws);
                break;

            case 'athlete_warning':
                broadcastToSession(ws.sessionId, {
                    type: 'athlete_warning',
                    ...data
                }, ws);
                break;
        }
    });

    ws.on('close', () => {
        if (ws.sessionId && sessions.has(ws.sessionId)) {
            const session = sessions.get(ws.sessionId);
            session.delete(ws);
            if (session.size === 0) {
                sessions.delete(ws.sessionId);
            } else {
                broadcastToSession(ws.sessionId, {
                    type: 'device_left',
                    timestamp: new Date().toISOString()
                });
            }
        }
    });
});

function broadcastToSession(sessionId, data, exclude = null) {
    const session = sessions.get(sessionId);
    if (session) {
        const message = JSON.stringify(data);
        for (const client of session) {
            if (client !== exclude && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        }
    }
}

// Create endpoint to get current session
app.get('/current-session', (req, res) => {
    res.json({ sessionId: currentSessionId });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
