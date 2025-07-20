#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Starting Gift-Link App Test Suite...\n');

const tests = [
  {
    name: 'Backend API Tests',
    command: 'npm',
    args: ['test'],
    cwd: path.join(__dirname, 'giftlink-backend')
  },
  {
    name: 'Frontend Component Tests',
    command: 'npm',
    args: ['test', '--', '--watchAll=false'],
    cwd: path.join(__dirname, 'giftlink-frontend')
  },
  {
    name: 'Sentiment Analysis Tests',
    command: 'npm',
    args: ['test'],
    cwd: path.join(__dirname, 'sentiment')
  }
];

let completedTests = 0;
let failedTests = 0;

function runTest(test) {
  return new Promise((resolve) => {
    console.log(`\n📋 Running ${test.name}...`);
    
    const child = spawn(test.command, test.args, {
      cwd: test.cwd,
      stdio: 'pipe',
      shell: true
    });

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('close', (code) => {
      completedTests++;
      
      if (code === 0) {
        console.log(`✅ ${test.name} - PASSED`);
      } else {
        console.log(`❌ ${test.name} - FAILED (Exit code: ${code})`);
        failedTests++;
        
        if (output) {
          console.log('Output:', output);
        }
        if (errorOutput) {
          console.log('Errors:', errorOutput);
        }
      }
      
      resolve();
    });
  });
}

async function runAllTests() {
  console.log('🚀 Starting test execution...\n');
  
  for (const test of tests) {
    try {
      await runTest(test);
    } catch (error) {
      console.log(`❌ ${test.name} - ERROR: ${error.message}`);
      failedTests++;
    }
  }
  
  console.log('\n📊 Test Summary:');
  console.log(`Total tests run: ${completedTests}`);
  console.log(`Passed: ${completedTests - failedTests}`);
  console.log(`Failed: ${failedTests}`);
  
  if (failedTests === 0) {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('\n💥 Some tests failed!');
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n⏹️  Test execution interrupted by user');
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('\n\n⏹️  Test execution terminated');
  process.exit(1);
});

// Run the tests
runAllTests().catch((error) => {
  console.error('💥 Test runner error:', error);
  process.exit(1);
});