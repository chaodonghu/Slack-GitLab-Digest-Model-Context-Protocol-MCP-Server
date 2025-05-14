import dotenv from "dotenv";
dotenv.config();

interface FetchMergeRequestsArgs {
  fullPath: string;
  username: string;
  from?: Date;
  to?: Date;
}

interface MergeRequestsResponse {
  data: {
    project: {
      mergeRequests: {
        nodes: Array<{
          title: string;
          webUrl: string;
          createdAt: string;
          author: {
            username: string;
          };
        }>;
      };
    };
  };
}

class GitLabClient {
  private gitlabToken: string;

  constructor(gitlabToken: string) {
    if (!gitlabToken) {
      console.error("GITLAB_TOKEN environment variable is not set");
      process.exit(1);
    }

    this.gitlabToken = gitlabToken;
  }

  // Hardcode the full path and username for now
  async fetchMergeRequests({
    fullPath,
    username,
    from,
    to,
  }: FetchMergeRequestsArgs) {
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
          first: 50,
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
          from: "2025-05-01T00:00:00Z",
          to: "2025-06-01T00:00:00Z",
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as MergeRequestsResponse;
    const nodes = data.data.project.mergeRequests.nodes;
    return nodes;
  }

  // async getAllCommentsByUserInProject({
  //   projectId,
  //   username,
  // }: {
  //   projectId: number;
  //   username: string;
  // }) {
  //   const userComments: any[] = [];

  //   // Step 1: Get ALL MRs in the project (can paginate if needed)
  //   const mrRes = await fetch(
  //     `https://gitlab.com/api/v4/projects/${projectId}/merge_requests?scope=all&per_page=100&state=all`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${this.gitlabToken}`,
  //       },
  //     },
  //   );

  //   if (!mrRes.ok) {
  //     throw new Error(
  //       `Failed to fetch merge requests for project ${projectId}`,
  //     );
  //   }

  //   const mergeRequests = await mrRes.json();

  //   // Step 2: For each MR, fetch its comments and filter by user
  //   for (const mr of mergeRequests) {
  //     const notesRes = await fetch(
  //       `https://gitlab.com/api/v4/projects/${projectId}/merge_requests/${mr.iid}/notes`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );

  //     if (!notesRes.ok) {
  //       console.warn(`Failed to fetch notes for MR !${mr.iid}`);
  //       continue;
  //     }

  //     const notes = await notesRes.json();

  //     const matchingNotes = notes.filter(
  //       (note: any) => note.author?.username === username,
  //     );

  //     userComments.push(
  //       ...matchingNotes.map((note) => ({
  //         body: note.body,
  //         created_at: note.created_at,
  //         url:
  //           note?.noteable_url ||
  //           `https://gitlab.com/${projectId}/-/merge_requests/${mr.iid}#note_${note.id}`,
  //         mr_iid: mr.iid,
  //         mr_title: mr.title,
  //       })),
  //     );
  //   }

  //   return userComments;
  // }
}

export default GitLabClient;
