// Test using REST API approach (same as the HTML file)
const fetch = require('node-fetch');

const UPSTASH_URL = 'https://kind-alien-18447.upstash.io';
const UPSTASH_TOKEN = 'AUgPAAIjcDFiOTlkM2Q4OWU1Y2U0NmZiYjcxN2M0YTdhNjllZmY0MHAxMA';

async function testRedisREST() {
  try {
    console.log('🚀 Starting Redis REST API test...\n');

    // Test 1: Set a value
    console.log('📝 Test 1: Setting a value via REST API');
    const setResponse = await fetch(`${UPSTASH_URL}/set/test_key/test_value`, {
      headers: { 'Authorization': `Bearer ${UPSTASH_TOKEN}` }
    });

    if (!setResponse.ok) {
      throw new Error(`HTTP ${setResponse.status}: ${setResponse.statusText}`);
    }

    const setResult = await setResponse.json();
    console.log('   Set response:', setResult);

    // Test 2: Get the value back
    console.log('\n📝 Test 2: Getting the value via REST API');
    const getResponse = await fetch(`${UPSTASH_URL}/get/test_key`, {
      headers: { 'Authorization': `Bearer ${UPSTASH_TOKEN}` }
    });

    if (!getResponse.ok) {
      throw new Error(`HTTP ${getResponse.status}: ${getResponse.statusText}`);
    }

    const getResult = await getResponse.json();
    console.log('   Get response:', getResult);

    // Test 3: Verify the value
    if (getResult.result === 'test_value') {
      console.log('\n✅ REST API test PASSED!');
      console.log('   - Can write data');
      console.log('   - Can read data');
      console.log('   - Values match correctly');
    } else {
      console.log('\n❌ REST API test FAILED!');
      console.log(`   Expected: test_value`);
      console.log(`   Got: ${getResult.result}`);
    }

    // Test 4: Cleanup
    console.log('\n📝 Test 3: Cleaning up test data');
    await fetch(`${UPSTASH_URL}/del/test_key`, {
      headers: { 'Authorization': `Bearer ${UPSTASH_TOKEN}` }
    });
    console.log('   ✅ Test data cleaned up');

  } catch (error) {
    console.error('\n❌ REST API test failed:', error.message);
    if (error.message.includes('401')) {
      console.error('🔐 Authentication failed - check your token');
    } else if (error.message.includes('403')) {
      console.error('🚫 Access denied - check your permissions');
    }
  }
}

// Run the test
testRedisREST();
