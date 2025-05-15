"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserActivity = getUserActivity;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const web_api_1 = require("@slack/web-api");
// Initialize Slack client with token from environment variable
const slackToken = process.env.SLACK_API_TOKEN;
if (!slackToken) {
    console.error("SLACK_API_TOKEN environment variable is not set");
    process.exit(1);
}
const slack = new web_api_1.WebClient(slackToken);
/**
 * Get all user activity (messages, reactions, replies) from Slack
 */
async function getUserActivity(userSlackId, startTime, endTime) {
    const activity = {
        messages: [],
        reactions: [],
        replies: [],
    };
    try {
        // TODO: Add functionality to add the slack bot to every channel
        // slack.conversations.list??
        // https://api.slack.com/methods/conversations.list
        // Get all conversations for the user (limit 999)
        const conversationsResponse = await slack.users.conversations({
            user: userSlackId,
            types: "public_channel,private_channel,mpim,im",
            exclude_archived: true,
            limit: 999,
        });
        if (!conversationsResponse.channels) {
            return activity;
        }
        const channels = conversationsResponse.channels;
        // For each channel, get messages from the user in the given time range
        for (const channel of channels) {
            if (!channel.id)
                continue;
            // Get user's messages in this channel
            const messagesResponse = await slack.conversations.history({
                channel: channel.id,
                // TODO: Add functionality to get messages from a specific time range - comment out for now since we're testing
                // oldest: startTime.toString(),
                // latest: endTime.toString(),
                limit: 100,
            });
            if (!messagesResponse.messages)
                continue;
            // console.log("messagesResponse!!!!!!!!", messagesResponse);
            // Filter messages by the user and add to activity
            // Get rid of subtype messages
            const userMessages = messagesResponse.messages.filter((msg) => msg.user === userSlackId && !msg.subtype && !msg.thread_ts);
            activity.messages.push(...userMessages);
            // Get reactions where user was involved
            const reactedMessages = messagesResponse.messages.filter((msg) => msg.reactions &&
                msg.reactions.some((reaction) => reaction.users && reaction.users.includes(userSlackId)));
            for (const msg of reactedMessages) {
                if (!msg.reactions)
                    continue;
                for (const reaction of msg.reactions) {
                    if (reaction.users &&
                        reaction.users.includes(userSlackId) &&
                        reaction.name) {
                        activity.reactions.push({
                            message: msg,
                            reaction: reaction.name,
                        });
                    }
                }
            }
            // Get all threads where user participated
            const channelId = channel.id; // Store channel.id in a variable
            const threadsPromises = messagesResponse.messages
                .filter((msg) => msg.thread_ts && msg.user === userSlackId)
                .map(async (msg) => {
                if (!msg.thread_ts)
                    return [];
                const repliesResponse = await slack.conversations.replies({
                    channel: channelId,
                    ts: msg.thread_ts,
                    // oldest: startTime.toString(),
                    // latest: endTime.toString(),
                });
                if (!repliesResponse.messages)
                    return [];
                return repliesResponse.messages.filter((reply) => reply.user === userSlackId);
            });
            const threadReplies = await Promise.all(threadsPromises);
            for (const replies of threadReplies) {
                // console.log("replies!!!!!!!!", replies);
                activity.replies.push(...replies);
            }
        }
        return activity;
    }
    catch (error) {
        console.error("Error getting user activity from Slack:", error);
        return activity;
    }
}
