const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_24VIdjQwyvsD@ep-winter-band-a2uptszf-pooler.eu-central-1.aws.neon.tech/neondb',
    ssl: {
        rejectUnauthorized: false
    }
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to database. Server time:', res.rows[0].now);
    }
});

module.exports = pool;
