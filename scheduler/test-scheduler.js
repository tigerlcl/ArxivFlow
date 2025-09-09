#!/usr/bin/env node

/**
 * Test script for Dify Workflow Scheduler
 * This script helps you test your configuration before deploying to GitHub Actions
 * Based on: https://github.com/leochen-g/dify-schedule/blob/main/workflow/dify.js
 */

import { run } from './arxiv-scheduler.js';

async function testScheduler() {
  console.log('🧪 Dify Workflow Scheduler Test Mode');
  console.log('=====================================');
  
  // Check environment variables
  console.log('\n🔍 Checking Configuration...');
  console.log(`DIFY_BASE_URL: ${process.env.DIFY_BASE_URL || 'https://api.dify.ai/v1 (default)'}`);
  console.log(`DIFY_TOKENS: ${process.env.DIFY_TOKENS ? '✅ Configured' : '❌ Missing'}`);
  console.log(`DIFY_INPUTS: ${process.env.DIFY_INPUTS || '{}'}`);
  
  if (!process.env.DIFY_TOKENS) {
    console.error('\n❌ DIFY_TOKENS is required. Please set this environment variable.');
    console.log('\nExample:');
    console.log('export DIFY_TOKENS="your_token_here"');
    console.log('node scheduler/test-scheduler.js');
    process.exit(1);
  }
  
  console.log('\n🚀 Starting test execution...');
  console.log('This will run the actual scheduler with your configuration.\n');
  
  try {
    // Import and run the main scheduler
    const results = await run();
    console.log('\n✅ Test completed successfully!');
    console.log(`📊 Processed ${results.length} workflow(s)`);
  } catch (error) {
    console.error('\n💥 Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testScheduler();
}
