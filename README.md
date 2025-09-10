# ArxivFlow - Periodic Track on arXiv Paper

English | [中文](README_CN.md)

Author: Tiger, member from [HKUST Dial](https://github.com/HKUSTDial)

Last update: September 09, 2025

## 🎯 Objectives
This workflow serves for tracking daily updates in arXiv.org. Paper info will be preprocessed and concluded by a series of modules. Finally, it will post to a group chat in Feishu for reading. The target audience is for education and research community.

> 💰 Cost: less than 0.05 CNY per workflow execution.

## ✨ Key Features

- 📚 Automatically fetch latest arXiv papers
- 🤖 AI-powered paper summarization and filtering
- 📱 Auto-send to Feishu group chat
- ⏰ GitHub Actions automated scheduling
- 🛠️ Local debugging script support

## 📋 Prerequisites

Before getting started, please ensure you have prepared the following accounts and services:

1. **[Dify](https://dify.ai/) account** - Free registration for building AI workflows
2. **LLM Provider API** - Recommended [DeepSeek API](https://platform.deepseek.com/api_keys) (cost-effective)
3. **[Jina](https://jina.ai/) API key** - For web content extraction, new users get 1M free credits
4. **Feishu Group Bot Webhook** - For message pushing

## 🚀 Quick Start

### Step 1: Setup Dify Workflow

1. **Open Dify Console**
   - Login to Dify and find the "Studio" tab
   ![](image/dify_studio.png)

2. **Import Workflow**
   - Create a new workflow by importing [this DSL file](dsl/ArxivDairy.yml)
   - This DSL file contains the complete logic for paper fetching, processing, and pushing

3. **Configure Environment Variables**
   - Configure necessary environment variables in workflow settings
   ![](image/env.png)
   - See detailed configuration in **Environment Variables Configuration** section below

4. **Get API Token**
   - Get your workflow API token from workflow settings
   - This token will be used for automated scheduling

### Step 2: Setup Automated Scheduler (Recommended)

The project provides an integrated scheduler that can trigger Dify-side workflows on schedule.

#### Quick Setup:

1. **Configure GitHub Secrets**:
   - Go to repository Settings > Secrets and variables > Actions > New repository secret
   - Add secret `DIFY_TOKENS`: Your Dify workflow API token (separate multiple tokens with `;`)

2. **Enable GitHub Actions**: Go to repository Actions tab and enable workflows

3. **Automatic Execution**: The scheduler will automatically run according to timing rules defined in [dify-scheduler.yml](.github/workflows/dify-scheduler.yml). For syntax details, see [cron.help](https://cron.help/).

### Manual Execution:
- **GitHub Actions**: Go to Actions tab > "Dify ArxivFlow Scheduler" > "Run workflow"
- **Local Testing**: 
  ```bash
  npm install
  # Set environment variables
  export DIFY_TOKENS="your_workflow_token_here"
  npm start
  ```

### 📱 Final Result

![](image/feishu_demo.png)

The scheduler will automatically:
- ✅ Execute your Dify workflow daily
- 📊 Log execution results and status
- ❌ Report any errors to GitHub Actions logs
- 🔄 Support multiple workflows if needed

## 🔧 Environment Variables Configuration

### GitHub Actions Secrets (Required):
- `DIFY_TOKENS`: Your Dify workflow API token, separate multiple workflows with `;`

### Optional Configuration:
- `DIFY_BASE_URL`: Dify API base URL (default: `https://api.dify.ai/v1`)
- `DIFY_INPUTS`: Workflow input variables in JSON format (default: `{}`)

### Dify Workflow Internal Environment Variables:
- `FEISHU_DEV` / `FEISHU_PROD`: Feishu Group Bot Webhook for testing/production environments
- `JINA`: API key for crawling arXiv search results
- `KEYWORDS`: Keywords for arXiv paper search, comma-separated
  - The number of KEYWORDS and sending frequency needs to match the timing rules in GitHub Actions
  - Example: If sending 4 pushes daily, KEYWORDS needs 4 keywords, and timing rules need 4 time points
- `PAPER_NUM_MAX`: Maximum number of papers per message (limited by Feishu message length)

## 🛠️ Debugging Scripts

The `/scripts` folder contains scripts for local debugging and testing, simulating the processes used in Dify Workflow:

- **`jina_extract.py`**: Simulates Jina API calls and paper information extraction logic
- **`sample.text`**: Sample data returned by Jina API for local testing
- **`extracted_papers.json`**: Example of structured paper data after extraction, serves as input for downstream LLM analysis in workflow

These scripts help you test and debug paper extraction logic without consuming API credits.

### Usage for Local Development:
```bash
cd scripts
python jina_extract.py
```

## 🤝 Acknowledgement
- Dify Official Guidance: [Link](https://docs.dify.ai/docs/workflow/overview)
- Feishu - How to use Bot in Group Chat: [Link (Chinese)](https://www.feishu.cn/hc/zh-CN/articles/360024984973-%E5%9C%A8%E7%BE%A4%E7%BB%84%E4%B8%AD%E4%BD%BF%E7%94%A8%E6%9C%BA%E5%99%A8%E4%BA%BA?from=in-im-bot)
- AWS Workshop: Lab3-使用Dify构建AI Workflow: [Link (Chinese)](https://catalog.us-east-1.prod.workshops.aws/workshops/2c19fcb1-1f1c-4f52-b759-0ca4d2ae2522/zh-CN)
- arXiv Category: [Link](https://arxiv.org/category_taxonomy)
- Dify Schedule Project: [Link](https://github.com/leochen-g/dify-schedule) - Inspiration for the automated scheduler implementation

## 📄 License

MIT License - See [LICENSE](LICENSE) file

