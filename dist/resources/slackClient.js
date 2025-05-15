"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SlackClient {
    constructor(botToken) {
        this.botHeaders = {
            Authorization: `Bearer ${botToken}`,
            "Content-Type": "application/json",
        };
    }
    async getChannels(limit = 100, cursor) {
        const predefinedChannelIds = process.env.SLACK_CHANNEL_IDS;
        if (!predefinedChannelIds) {
            const params = new URLSearchParams({
                types: "public_channel",
                exclude_archived: "true",
                limit: Math.min(limit, 200).toString(),
                team_id: process.env.SLACK_TEAM_ID,
            });
            if (cursor) {
                params.append("cursor", cursor);
            }
            const response = await fetch(`https://slack.com/api/conversations.list?${params}`, { headers: this.botHeaders });
            return response.json();
        }
        const predefinedChannelIdsArray = predefinedChannelIds
            .split(",")
            .map((id) => id.trim());
        const channels = [];
        for (const channelId of predefinedChannelIdsArray) {
            const params = new URLSearchParams({
                channel: channelId,
            });
            const response = await fetch(`https://slack.com/api/conversations.info?${params}`, { headers: this.botHeaders });
            const data = (await response.json());
            if (data.ok && data.channel && !data.channel.is_archived) {
                channels.push(data.channel);
            }
        }
        return {
            ok: true,
            channels: channels,
            response_metadata: { next_cursor: "" },
        };
    }
    async getChannelHistory(channel_id, limit = 10) {
        const params = new URLSearchParams({
            channel: channel_id,
            limit: limit.toString(),
        });
        const response = await fetch(`https://slack.com/api/conversations.history?${params}`, { headers: this.botHeaders });
        return response.json();
    }
    async getThreadReplies(channel_id, thread_ts) {
        const params = new URLSearchParams({
            channel: channel_id,
            ts: thread_ts,
        });
        const response = await fetch(`https://slack.com/api/conversations.replies?${params}`, { headers: this.botHeaders });
        return response.json();
    }
    async getUsers(limit = 100, cursor) {
        const params = new URLSearchParams({
            limit: Math.min(limit, 200).toString(),
            team_id: process.env.SLACK_TEAM_ID,
        });
        if (cursor) {
            params.append("cursor", cursor);
        }
        const response = await fetch(`https://slack.com/api/users.list?${params}`, {
            headers: this.botHeaders,
        });
        return response.json();
    }
}
exports.default = SlackClient;
