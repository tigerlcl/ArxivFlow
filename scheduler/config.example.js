/**
 * ArxivFlow Scheduler Configuration Example
 * 
 * For GitHub Actions deployment, configure these as repository secrets:
 * - DIFY_BASE_URL (optional)
 * - DIFY_TOKENS (required)
 * - DIFY_INPUTS (optional)
 */

module.exports = {
  // Dify API Configuration
  dify: {
    // Base URL for Dify API (default: https://api.dify.ai/v1)
    baseUrl: process.env.DIFY_BASE_URL || 'https://api.dify.ai/v1',
    
    // Workflow tokens (separate multiple tokens with semicolon)
    // Example: 'token1;token2;token3'
    tokens: process.env.DIFY_TOKENS || '',
    
    // Input variables for workflows (JSON format)
    // Example: '{"keyword": "machine learning", "limit": 5}'
    inputs: process.env.DIFY_INPUTS ? JSON.parse(process.env.DIFY_INPUTS) : {}
  },

  // Scheduler Configuration
  scheduler: {
    // Default timezone for logging
    timezone: 'Asia/Shanghai',
    
    // Timeout for workflow execution (milliseconds)
    workflowTimeout: 300000 // 5 minutes
  }
};
