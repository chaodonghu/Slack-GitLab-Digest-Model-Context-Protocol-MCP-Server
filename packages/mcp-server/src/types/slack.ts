// Type definitions for tool arguments
export interface ListChannelsArgs {
  limit?: number;
  cursor?: string;
}

export interface GetChannelHistoryArgs {
  channel_id: string;
  limit?: number;
}

export interface GetThreadRepliesArgs {
  channel_id: string;
  thread_ts: string;
}

export interface GetUsersArgs {
  cursor?: string;
  limit?: number;
}

export interface ChannelInfo {
  ok: boolean;
  channel?: {
    is_archived: boolean;
  };
}

export interface GetUserActivityArgs {
  user_id: string;
  start?: number;
  end?: number;
}

export interface SummarizeActivityArgs {
  user_id: string;
  start?: number;
  end?: number;
}
