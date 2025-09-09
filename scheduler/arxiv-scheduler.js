#!/usr/bin/env node

const axios = require('axios');

class ArxivFlowScheduler {
  constructor() {
    this.difyBaseUrl = process.env.DIFY_BASE_URL || 'https://api.dify.ai/v1';
    this.difyTokens = process.env.DIFY_TOKENS ? process.env.DIFY_TOKENS.split(';') : [];
    this.difyInputs = process.env.DIFY_INPUTS ? JSON.parse(process.env.DIFY_INPUTS) : {};
    
    if (this.difyTokens.length === 0) {
      throw new Error('DIFY_TOKENS environment variable is required');
    }
  }

  /**
   * Execute Dify workflow
   * @param {string} token - Dify workflow API token
   * @param {object} inputs - Input variables for the workflow
   * @returns {Promise<object>} - Workflow execution result
   */
  async executeDifyWorkflow(token, inputs = {}) {
    const url = `${this.difyBaseUrl}/workflows/run`;
    
    const payload = {
      inputs: { ...this.difyInputs, ...inputs },
      response_mode: 'blocking',
      user: 'arxivflow-scheduler'
    };

    try {
      console.log(`🚀 Executing Dify workflow...`);
      console.log(`📍 URL: ${url}`);
      console.log(`📝 Inputs:`, JSON.stringify(payload.inputs, null, 2));
      
      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 300000 // 5 minutes timeout
      });

      if (response.data.data && response.data.data.status === 'succeeded') {
        console.log('✅ Workflow executed successfully');
        return {
          success: true,
          data: response.data.data,
          outputs: response.data.data.outputs || {}
        };
      } else {
        console.error('❌ Workflow execution failed:', response.data);
        return {
          success: false,
          error: response.data.message || 'Unknown error',
          data: response.data
        };
      }
    } catch (error) {
      console.error('❌ Error executing Dify workflow:', error.message);
      if (error.response) {
        console.error('📄 Response data:', error.response.data);
        console.error('📊 Response status:', error.response.status);
      }
      return {
        success: false,
        error: error.message,
        details: error.response?.data
      };
    }
  }

  /**
   * Format workflow output for console display
   * @param {object} outputs - Workflow outputs
   * @returns {string} - Formatted content
   */
  formatWorkflowOutput(outputs) {
    if (!outputs || Object.keys(outputs).length === 0) {
      return 'No output data available from the workflow.';
    }

    let content = '';
    
    // Handle common ArxivFlow outputs
    if (outputs.result || outputs.summary || outputs.papers) {
      const result = outputs.result || outputs.summary || outputs.papers;
      content = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    } else {
      // Generic output formatting
      content = Object.entries(outputs)
        .map(([key, value]) => {
          const displayValue = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
          return `${key}: ${displayValue}`;
        })
        .join('\n');
    }

    return content;
  }

  /**
   * Run the scheduler
   */
  async run() {
    console.log('🎯 ArxivFlow Scheduler Starting...');
    console.log(`⏰ Execution time: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })} (Beijing Time)`);
    console.log(`🔧 Configured workflows: ${this.difyTokens.length}`);

    let successCount = 0;
    let errorCount = 0;
    const results = [];

    // Execute all configured workflows
    for (let i = 0; i < this.difyTokens.length; i++) {
      const token = this.difyTokens[i].trim();
      console.log(`\n🔄 Processing workflow ${i + 1}/${this.difyTokens.length}`);
      
      try {
        const result = await this.executeDifyWorkflow(token);
        results.push(result);
        
        if (result.success) {
          successCount++;
          console.log('✅ Workflow completed successfully');
          
          // Display workflow output
          const content = this.formatWorkflowOutput(result.outputs);
          console.log('📄 Workflow Output:');
          console.log(content);
        } else {
          errorCount++;
          console.error(`❌ Workflow failed: ${result.error}`);
          if (result.details) {
            console.error('📄 Error details:', JSON.stringify(result.details, null, 2));
          }
        }
      } catch (error) {
        console.error(`❌ Unexpected error processing workflow ${i + 1}:`, error);
        errorCount++;
        results.push({
          success: false,
          error: error.message
        });
      }
    }

    // Summary
    console.log('\n📊 Execution Summary:');
    console.log(`✅ Successful workflows: ${successCount}`);
    console.log(`❌ Failed workflows: ${errorCount}`);
    console.log(`📈 Total workflows: ${this.difyTokens.length}`);
    console.log(`⏰ Completed at: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })} (Beijing Time)`);

    // Exit with appropriate code
    process.exit(errorCount > 0 ? 1 : 0);
  }
}

// Run the scheduler
if (require.main === module) {
  const scheduler = new ArxivFlowScheduler();
  scheduler.run().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

module.exports = ArxivFlowScheduler;
