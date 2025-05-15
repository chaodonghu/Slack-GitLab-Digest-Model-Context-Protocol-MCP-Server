"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizeSlackActivityTool = exports.getSlackUserActivityTool = void 0;
exports.getSlackUserActivityTool = {
    name: "slack_get_user_activity",
    description: "Get messages, reactions and replies for a specific user for a specific timeframe",
    inputSchema: {
        type: "object",
        properties: {
            user_id: {
                type: "string",
                description: "The ID of the user",
            },
            // TODO: Add a date range picker for the timeframe
            timeframe: {
                type: "string",
                description: "The timeframe to get activity for, e.g. 'yesterday', 'last_7_days', 'last_30_days'",
            },
        },
        required: ["user_id"],
    },
};
exports.summarizeSlackActivityTool = {
    name: "summarize_slack_activity",
    description: "Summarizes slack activity",
    inputSchema: {
        type: "object",
        properties: {
            user_id: {
                type: "string",
                description: "The ID of the user",
            },
        },
        required: ["user_id"],
    },
};
