#!/usr/bin/env node

/**
 * Test script for ArxivFlow Scheduler
 * This script helps you test your configuration before deploying to GitHub Actions
 */

const ArxivFlowScheduler = require('./arxiv-scheduler');

async function testScheduler() {
  console.log('🧪 ArxivFlow Scheduler Test Mode');
  console.log('=====================================');
  
  // Check environment variables
  console.log('\n🔍 Checking Configuration...');
  console.log(`DIFY_BASE_URL: ${process.env.DIFY_BASE_URL || 'https://api.dify.ai/v1 (default)'}`);
  console.log(`DIFY_TOKENS: ${process.env.DIFY_TOKENS ? '✅ Configured' : '❌ Missing'}`);
  console.log(`DIFY_INPUTS: ${process.env.DIFY_INPUTS || '{}' }`);
  
  if (!process.env.DIFY_TOKENS) {
    console.error('\n❌ DIFY_TOKENS is required. Please set this environment variable.');
    console.log('\nExample:');
    console.log('export DIFY_TOKENS="your_token_here"');
    console.log('node scheduler/test-scheduler.js');
    process.exit(1);
  }
  
  console.log('\n🚀 Starting test execution...');
  
  try {
    const scheduler = new ArxivFlowScheduler();
    await scheduler.run();
  } catch (error) {
    console.error('\n💥 Test failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  testScheduler();
}
