import { WorkflowClient } from './dify.js'

const env = process.env || {};

// Configuration constants
const DEFAULT_BASE_URL = 'https://api.dify.ai/v1';
const DEFAULT_USER = 'dify-schedule';

export const { DIFY_BASE_URL, DIFY_TOKENS } = env;

class WorkflowTask {
    constructor(token) {
      this.token = token;
      this.result = '';
    }

    async run() {
      const baseUrl = env.DIFY_BASE_URL || DEFAULT_BASE_URL;
      
      let inputs = {}
      try {
        inputs = env.DIFY_INPUTS ? JSON.parse(env.DIFY_INPUTS) : {}
      } catch (error) {
        console.error('DIFY_INPUTS format error, please ensure it is valid JSON format, this may affect workflow execution')
      }
      
      const workflow = new WorkflowClient(this.token, baseUrl);
      console.log(`Getting Dify workflow basic information...`)
      
      const info = await workflow.info(DEFAULT_USER);
      console.log(`Dify workflow [${info.data.name}] starting execution...`)
      
      const response = await workflow.getWorkflowResult(inputs, DEFAULT_USER, true)
      this.result = response.text || ''
    }

    toString() {
        return this.result
    }
}

export async function run() {
    if (!env.DIFY_TOKENS) {
      throw new Error("DIFY_TOKENS environment variable is required");
    }
    
    const tokens = env.DIFY_TOKENS.split(';');
    const results = [];
    
    for (const token of tokens) {
      const workflow = new WorkflowTask(token);
      await workflow.run();
      
      const result = workflow.toString();
      console.log(result); // Print results
      results.push(result);
    }
    
    return results;
  }

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  run().catch(error => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  });
}