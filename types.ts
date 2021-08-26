export interface Author {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
}

export interface Message {
  id: string;
  type: number;
  content: string;
  channel_id: string;
  author: Author;
  attachments: any[];
  embeds: any[];
  mentions: any[];
  mention_roles: any[];
  pinned: boolean;
  mention_everyone: boolean;
  tts: boolean;
  timestamp: Date;
  edited_timestamp?: any;
  flags: number;
  components: any[];
  referenced_message?: any;
}

export interface Error {
  error: string;
}

export interface Embed {
  author?: {
    name?: string;
    url?: string;
    icon_url?: string;
  };
  title?: string;
  url?: string;
  description?: string;
  color?: string;
  fields: [
    {
      name?: string;
      value?: string;
      inline?: boolean;
    }
  ];
  thumbnail?: {
    url?: string;
  };
  image?: {
    url?: string;
  };
  footer?: {
    text?: string;
    icon_url?: string;
  };
}

export interface WebHook {
  username?: string;
  avatar_url?: string;
  content?: string;
  embeds?: Embed[];
}
