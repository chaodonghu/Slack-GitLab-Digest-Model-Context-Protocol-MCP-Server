
export interface GetMergeRequestsArgs {
  full_paths?: string[];
  username: string;
  from?: Date;
  to?: Date;
}

export interface SummarizeGitlabActivityArgs {
  username: string;
}
