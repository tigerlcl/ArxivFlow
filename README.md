# ArxivFlow
Workflow - Periodic Track on Arxiv.org Paper

Author: Tiger, member from [HKUST Dial](https://github.com/HKUSTDial)

Last update: September 09, 2025

# Objectives
This workflow serves for tracking daily updates in Arxiv.org. Paper info will be preprocessed and concluded by a series of modules. Finally, it will post to a group chat in Feishu for reading. The target audience is for education and research community.

> Cost: less than 0.05 CNY per workflow execution.

# Prerequisites
- A [Dify](https://dify.ai/) account, sign up for free plan.
- A LLM provider API (I use [DeepSeek API](https://platform.deepseek.com/api_keys))
- A [Jina](https://jina.ai/) API key (1M Free credits for new users)
- A Group Bot webhook (For Feishu group chat robot)

# How to build your own workflow?

## Step 1: Setup Dify Workflow
1. Open your Dify Cloud and find the "Studio" tab.![](image/dify_studio.png)
2. Create a new workflow via import [this](dsl/ArxivDairy.yml) DSL file
3. Configure the environment variables in the workflow. ![](image/env.png)
4. Get your workflow API token from the workflow settings

## Step 2: Setup Automated Scheduler (Recommended)
The project now includes an integrated scheduler that runs your workflow automatically. Since your Dify workflow already handles Feishu messaging internally, the scheduler simply executes the workflow and logs the results.

### Quick Setup:
1. **Configure GitHub Secrets**: Go to your repository Settings > Secrets and variables > Actions > New repository secret, and add:
   - `DIFY_TOKENS`: Your Dify workflow API token(s) - separate multiple tokens with `;`
   - `DIFY_BASE_URL`: (Optional) Dify API URL, defaults to `https://api.dify.ai/v1`
   - `DIFY_INPUTS`: (Optional) JSON format input variables if your workflow requires them

2. **Enable GitHub Actions**: Go to the Actions tab in your repository and enable workflows

3. **Automatic Execution**: The scheduler runs daily at 06:30 Beijing Time automatically

### Manual Execution:
- **GitHub Actions**: Go to Actions tab > "Dify ArxivFlow Scheduler" > "Run workflow"
- **Local Testing**: 
  ```bash
  npm install
  # Set environment variables
  export DIFY_TOKENS="your_workflow_token_here"
  npm start
  ```

## Final Result
![](image/feishu_demo.png)

The scheduler will automatically:
- ✅ Execute your Dify workflow daily
- 📊 Log execution results and status
- ❌ Report any errors to GitHub Actions logs
- 🔄 Support multiple workflows if needed

# Scheduler Configuration

## Environment Variables
Configure these as GitHub repository secrets or local environment variables:

### Required Variables:
- `DIFY_TOKENS`: Your Dify workflow API token(s). For multiple workflows, separate with `;`

### Optional Variables:
- `DIFY_BASE_URL`: Dify API base URL (default: `https://api.dify.ai/v1`)
- `DIFY_INPUTS`: JSON format input variables for workflows (default: `{}`)

## Original Dify Workflow Env Vars:
- `FEISHU_DEV` / `FEISHU_PROD`: Webhook of Feishu Group Bot for testing/deployment
- `JINA`: Web crawler API key for Arxiv.org
- `KEYWORDS`: Comma-separated keywords for Arxiv query
- `PAPER_NUM_MAX`: Maximum number of papers per message (Feishu message limits)


# Acknowledgement
- Dify Official Guidance: [Link](https://docs.dify.ai/docs/workflow/overview)
- Feishu - How to use Bot in Group Chat: [Link (Chinese)](https://www.feishu.cn/hc/zh-CN/articles/360024984973-%E5%9C%A8%E7%BE%A4%E7%BB%84%E4%B8%AD%E4%BD%BF%E7%94%A8%E6%9C%BA%E5%99%A8%E4%BA%BA?from=in-im-bot)
- AWS Workshop: Lab3-使用Dify构建AI Workflow: [Link (Chinese)](https://catalog.us-east-1.prod.workshops.aws/workshops/2c19fcb1-1f1c-4f52-b759-0ca4d2ae2522/zh-CN)
- arXiv Category: [Link](https://arxiv.org/category_taxonomy)
- Dify Schedule Project: [Link](https://github.com/leochen-g/dify-schedule) - Inspiration for the automated scheduler implementation

