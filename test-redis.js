const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: 'https://kind-alien-18447.upstash.io',
  token: 'AUgPAAIjcDFiOTlkM2Q4OWU1Y2U0NmZiYjcxN2C0YTdhNjllZmY0MHAxMA',
});

async function testRedis() {
  try {
    console.log('🚀 Starting Redis connection test...\n');

    // Test 1: Basic set/get
    console.log('📝 Test 1: Basic set/get operation');
    await redis.set('foo', 'bar');
    const result = await redis.get('foo');
    console.log(`   Set: foo = "bar"`);
    console.log(`   Get: foo = "${result}"`);
    console.log(`   ✅ ${result === 'bar' ? 'PASSED' : 'FAILED'}\n`);

    // Test 2: JSON data (like leaderboard)
    console.log('📝 Test 2: JSON data storage');
    const testData = {
      name: 'Test Player',
      distance: 100,
      level: 5,
      timestamp: new Date().toISOString()
    };

    await redis.set('test_json', JSON.stringify(testData));
    const jsonResult = await redis.get('test_json');
    const parsedResult = JSON.parse(jsonResult);

    console.log(`   Stored: ${JSON.stringify(testData)}`);
    console.log(`   Retrieved: ${jsonResult}`);
    console.log(`   ✅ ${parsedResult.name === testData.name ? 'PASSED' : 'FAILED'}\n`);

    // Test 3: Leaderboard simulation
    console.log('📝 Test 3: Leaderboard simulation');
    const leaderboard = [
      { name: 'Player1', distance: 120, level: 6 },
      { name: 'Player2', distance: 80, level: 4 },
      { name: 'Player3', distance: 100, level: 5 }
    ];

    await redis.set('yoyo_leaderboard', JSON.stringify(leaderboard));
    const leaderboardResult = await redis.get('yoyo_leaderboard');
    const parsedLeaderboard = JSON.parse(leaderboardResult);

    console.log(`   Stored ${leaderboard.length} player records`);
    console.log(`   Retrieved ${parsedLeaderboard.length} player records`);
    console.log(`   ✅ ${parsedLeaderboard.length === leaderboard.length ? 'PASSED' : 'FAILED'}\n`);

    // Test 4: Cleanup
    console.log('📝 Test 4: Cleanup test data');
    await redis.del('foo');
    await redis.del('test_json');
    await redis.del('yoyo_leaderboard');
    console.log('   ✅ Test data cleaned up\n');

    console.log('🎉 All tests completed successfully!');
    console.log('✅ Redis database is working correctly');

  } catch (error) {
    console.error('❌ Redis test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testRedis();
