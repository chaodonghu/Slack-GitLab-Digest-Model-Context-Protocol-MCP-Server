"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class GitLabClient {
    constructor(gitlabToken) {
        if (!gitlabToken) {
            console.error("GITLAB_TOKEN environment variable is not set");
            process.exit(1);
        }
        this.gitlabToken = gitlabToken;
    }
    // Hardcode the full path and username for now
    async fetchMergeRequests({ fullPath, username, from, to, }) {
        const query = `
    query MergeRequestsByUser(
      $fullPath: ID!,
      $username: String!,
      $after: String,
      $from: Time,
      $to: Time,
    ) {
      project(fullPath: $fullPath) {
        mergeRequests(
          authorUsername: $username,
          createdAfter: $from,
          createdBefore: $to,
          first: 100,
          after: $after
        ) {
          pageInfo {
            endCursor
            hasNextPage
          }
          nodes {
            title
            webUrl
            createdAt
            author {
              username
            }
          }
        }
      }
    }
    `;
        const response = await fetch("https://gitlab.com/api/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.gitlabToken}`,
            },
            body: JSON.stringify({
                query,
                variables: {
                    username: username,
                    fullPath: fullPath,
                    from: from,
                    to: to,
                },
            }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = (await response.json());
        const nodes = data.data.project.mergeRequests.nodes;
        return nodes;
    }
    async getAllCommentsByUserInProject({ fullPath, username, from, to, }) {
        const userComments = [];
        const query = `
    query ProjectMergeRequests($fullPath: ID!, $username: String!, $from: Time, $to: Time) {
      project(fullPath: $fullPath) {
        mergeRequests(authorUsername:$username, createdAfter: $from, createdBefore: $to, first: 100) {
          nodes {
            iid
            title
            notes {
              nodes {
                author {
                  username
                }
                body
                createdAt
                id
              }
            }
          }
        }
      }
    }
    `;
        const response = await fetch("https://gitlab.com/api/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.gitlabToken}`,
            },
            body: JSON.stringify({
                query,
                variables: {
                    fullPath: fullPath.toString(),
                    username: username,
                    from: from,
                    to: to,
                },
            }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = (await response.json());
        const mergeRequests = data.data.project.mergeRequests.nodes;
        for (const mr of mergeRequests) {
            const matchingNotes = mr.notes.nodes.filter((note) => note.author?.username === username);
            userComments.push(...matchingNotes.map((note) => ({
                body: note.body,
                created_at: note.createdAt,
                url: `https://gitlab.com/${fullPath}/-/merge_requests/${mr.iid}#note_${note.id}`,
                mr_iid: mr.iid,
                mr_title: mr.title,
            })));
        }
        return userComments;
    }
}
exports.default = GitLabClient;
