// src/summarize.ts
import OpenAI from "openai";
import { SlackActivity } from "./slack";

// Set up the OpenAI client
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("OPENAI_API_KEY environment variable is not set");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey,
});

/**
 * Format the Slack activity into a text representation
 */
function formatActivityForSummarization(activity: SlackActivity): string {
  const { messages, reactions, replies } = activity;

  let text = `# Slack Activity Summary\n\n`;

  if (messages.length > 0) {
    text += `## Direct Messages\n\n`;
    messages.forEach((msg) => {
      text += `- In channel <#${msg.channel}>: "${msg.text}"\n`;
    });
    text += `\n`;
  }

  if (replies.length > 0) {
    text += `## Thread Replies\n\n`;
    replies.forEach((reply) => {
      text += `- Reply in thread (channel <#${reply.channel}>): "${reply.text}"\n`;
    });
    text += `\n`;
  }

  if (reactions.length > 0) {
    text += `## Reactions\n\n`;
    reactions.forEach(({ message, reaction }) => {
      text += `- Reacted with :${reaction}: to "${message.text}" in <#${message.channel}>\n`;
    });
  }

  return text;
}

/**
 * Summarize Slack messages using OpenAI
 */
export async function summarizeSlackMessages(
  activity: SlackActivity,
): Promise<string> {
  try {
    // Format the activity data for the model
    const formattedActivity = formatActivityForSummarization(activity);

    // Create the model context and get the summary
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes Slack activity. Create a concise summary of the user's Slack activity in the given time period. Focus on the main topics of discussion, any important information shared, and general themes of conversation. Group similar activities together.",
        },
        {
          role: "user",
          content: formattedActivity,
        },
      ],
    });

    return response.choices[0]?.message?.content || "No summary generated";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Failed to generate summary due to an error.";
  }
}
