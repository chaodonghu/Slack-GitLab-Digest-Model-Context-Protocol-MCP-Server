import dotenv from "dotenv";

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import {
  GetUserActivityArgs,
  SummarizeActivityArgs,
  GetMergeRequestsArgs,
  SummarizeGitlabActivityArgs,
  GetCommentsArgs,
} from "./types";
import {
  getGitlabCommentsTool,
  getGitlabMergeRequestsTool,
  getSlackUserActivityTool,
  summarizeGitlabActivityTool,
  summarizeSlackActivityTool,
} from "./tools";

import {
  getUserActivity,
  summarizeSlackMessages,
  // SlackClient,
  GitlabClient,
  summarizeMergeRequests,
} from "./resources";

dotenv.config();

async function main() {
  // const botToken = process.env.SLACK_BOT_TOKEN;
  // const teamId = process.env.SLACK_TEAM_ID;
  const gitlabToken = process.env.GITLAB_TOKEN;
  const openaiApiKey = process.env.OPENAI_API_KEY;
  // if (!botToken || !teamId) {
  //   console.error(
  //     "Please set SLACK_BOT_TOKEN and SLACK_TEAM_ID environment variables",
  //   );
  //   process.exit(1);
  // }

  if (!gitlabToken) {
    console.error("Please set GITLAB_TOKEN environment variable");
    process.exit(1);
  }

  if (!openaiApiKey) {
    console.error("Please set OPENAI_API_KEY environment variable");
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
  // const slackClient = new SlackClient(botToken);
  const gitlabClient = new GitlabClient(process.env.GITLAB_TOKEN!);

  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: CallToolRequest) => {
      console.error("Received CallToolRequest:", request);
      try {
        if (!request.params.arguments) {
          throw new Error("No arguments provided");
        }

        switch (request.params.name) {
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

          case "summarize_slack_activity": {
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

          case "gitlab_get_merge_requests": {
            const args = request.params
              .arguments as unknown as GetMergeRequestsArgs;
            if (!args.username) {
              throw new Error("Missing required argument: username");
            }

            // Hardcode full paths for now
            const fullPaths = args.full_paths || [
              "zapier/team-enterprise-experience/account-management",
              "zapier/team-enterprise-experience/assetmanagement",
              "zapier/team-enterprise-experience/zhwdailysummarizer",
              "zapier/team-enterprise-experience/reporting",
              "zapier/team-enterprise-experience/zap-management",
              "zapier/design-systems/design-system-bff",
            ];

            const mergeRequests = await Promise.all(
              fullPaths.map((fullPath) =>
                gitlabClient.fetchMergeRequests({
                  fullPath,
                  username: args.username,
                  from: args.from,
                  to: args.to,
                }),
              ),
            );

            const flattenedMergeRequests = mergeRequests?.flat();

            return {
              content: [
                { type: "text", text: JSON.stringify(flattenedMergeRequests) },
              ],
            };
          }

          case "gitlab_get_comments": {
            const args = request.params.arguments as unknown as GetCommentsArgs;
            if (!args.username) {
              throw new Error("Missing required argument: username");
            }

            // Hardcode full paths for now
            const fullPaths = args.full_paths || [
              "zapier/team-enterprise-experience/account-management",
              "zapier/team-enterprise-experience/assetmanagement",
              "zapier/team-enterprise-experience/zhwdailysummarizer",
              // "zapier/team-enterprise-experience/reporting",
              "zapier/team-enterprise-experience/zap-management",
              // "zapier/design-systems/design-system-bff",
            ];

            const gitlabComments = await Promise.all(
              fullPaths.map((fullPath) =>
                gitlabClient.getAllCommentsByUserInProject({
                  fullPath,
                  username: args.username,
                  from: args.from,
                  to: args.to,
                }),
              ),
            );

            const flattenedGitlabComments = gitlabComments?.flat();

            return {
              content: [
                { type: "text", text: JSON.stringify(flattenedGitlabComments) },
              ],
            };
          }

          case "summarize_gitlab_activity": {
            const args = request.params
              .arguments as unknown as SummarizeGitlabActivityArgs;
            if (!args.username) {
              throw new Error("Missing required argument: username");
            }

            // Hardcode full paths for now
            const fullPaths = [
              "zapier/team-enterprise-experience/account-management",
              "zapier/team-enterprise-experience/assetmanagement",
              "zapier/team-enterprise-experience/zhwdailysummarizer",
            ];

            const mergeRequests = await Promise.all(
              fullPaths.map((fullPath) =>
                gitlabClient.fetchMergeRequests({
                  fullPath,
                  username: args.username,
                }),
              ),
            );

            const flattenedMergeRequests = mergeRequests?.flat();

            const summary = await summarizeMergeRequests(
              flattenedMergeRequests,
            );

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
        getGitlabCommentsTool,
        getGitlabMergeRequestsTool,
        getSlackUserActivityTool,
        summarizeGitlabActivityTool,
        summarizeSlackActivityTool,
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
