import dotenv from "dotenv";

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import {
  ListChannelsArgs,
  GetChannelHistoryArgs,
  GetThreadRepliesArgs,
  GetUsersArgs,
  GetUserActivityArgs,
  SummarizeActivityArgs,
} from "./types";
import {
  listChannelsTool,
  getChannelHistoryTool,
  getThreadRepliesTool,
  getUsersTool,
  getUserActivityTool,
  summarizeActivityTool,
} from "./tools";

import {
  getUserActivity,
  summarizeSlackMessages,
  SlackClient,
} from "./resources";

dotenv.config();

async function main() {
  const botToken = process.env.SLACK_BOT_TOKEN;
  const teamId = process.env.SLACK_TEAM_ID;

  if (!botToken || !teamId) {
    console.error(
      "Please set SLACK_BOT_TOKEN and SLACK_TEAM_ID environment variables",
    );
    process.exit(1);
  }

  console.error("Starting Task Summarizer Server...");
  const server = new Server(
    {
      name: "Task Summarizer Server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  // TODO: Consoliate slack client to a single instance (right now there are 2)
  const slackClient = new SlackClient(botToken);

  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: CallToolRequest) => {
      console.error("Received CallToolRequest:", request);
      try {
        if (!request.params.arguments) {
          throw new Error("No arguments provided");
        }

        switch (request.params.name) {
          case "slack_list_channels": {
            const args = request.params
              .arguments as unknown as ListChannelsArgs;
            const response = await slackClient.getChannels(
              args.limit,
              args.cursor,
            );
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          case "slack_get_channel_history": {
            const args = request.params
              .arguments as unknown as GetChannelHistoryArgs;
            if (!args.channel_id) {
              throw new Error("Missing required argument: channel_id");
            }
            const response = await slackClient.getChannelHistory(
              args.channel_id,
              args.limit,
            );
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          case "slack_get_thread_replies": {
            const args = request.params
              .arguments as unknown as GetThreadRepliesArgs;
            if (!args.channel_id || !args.thread_ts) {
              throw new Error(
                "Missing required arguments: channel_id and thread_ts",
              );
            }
            const response = await slackClient.getThreadReplies(
              args.channel_id,
              args.thread_ts,
            );
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          case "slack_get_users": {
            const args = request.params.arguments as unknown as GetUsersArgs;
            const response = await slackClient.getUsers(
              args.limit,
              args.cursor,
            );
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          case "slack_get_user_activity": {
            const args = request.params
              .arguments as unknown as GetUserActivityArgs;
            if (!args.user_id) {
              throw new Error("Missing required argument: user_id");
            }

            const response = await getUserActivity(
              // TODO: Add a date range picker for the timeframe
              args.user_id as string,
              args.start,
              args.end,
            );

            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          case "summarize_activity_tool": {
            const args = request.params
              .arguments as unknown as SummarizeActivityArgs;
            if (!args.user_id) {
              throw new Error("Missing required argument: user_id");
            }

            const activity = await getUserActivity(
              args.user_id as string,
              args.start,
              args.end,
            );
            const summary = await summarizeSlackMessages(activity);

            return {
              content: [{ type: "text", text: JSON.stringify(summary) }],
            };
          }

          default:
            throw new Error(`Unknown tool: ${request.params.name}`);
        }
      } catch (error) {
        console.error("Error executing tool:", error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: error instanceof Error ? error.message : String(error),
              }),
            },
          ],
        };
      }
    },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.error("Received ListToolsRequest");
    return {
      tools: [
        listChannelsTool,
        getChannelHistoryTool,
        getThreadRepliesTool,
        getUsersTool,
        getUserActivityTool,
        summarizeActivityTool,
      ],
    };
  });

  const transport = new StdioServerTransport();
  console.error("Connecting server to transport...");
  await server.connect(transport);

  console.error("Daily Summarizer MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

// HARDCODED USER IDS
// U08S3VB9LTW
