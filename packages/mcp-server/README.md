## Features

- **Summarizes Slack activity** for a user in different timeframes (today, yesterday, day before yesterday, last week)
- **Captures all types of activity** including direct messages, thread replies, and emoji reactions

## Setup

### Prerequisites

- Node.js (v18+)
- pnpm
- Slack API token with appropriate scopes
- OpenAI API key

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Create a `.env` file based on the following template:

```
# Server Configuration
PORT=3000

# Slack API Configuration
SLACK_API_TOKEN=xoxb-your-bot-token-here

# OpenAI API Configuration
OPENAI_API_KEY=your-openai-api-key-here
```

3. Start the server:

```bash
pnpm start
```

## License

MIT

## Test with MCP inspector

- https://github.com/modelcontextprotocol/inspector

From root directory `npx @modelcontextprotocol/inspector pnpm dev` which will start the MCP server
