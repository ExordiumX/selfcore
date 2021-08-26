import axios from "axios";
import { Message, Error, WebHook } from "./types";
import WebSocket from "ws";
import EventEmitter from "events";

const eventEmitter = new EventEmitter();

class Selfcore {
  token: string;
  headers: object;

  constructor(token: string) {
    this.token = token;
    this.headers = {
      authorization: this.token,
      accept: "*/*",
      "accept-language": "en-US",
      referer: "https://discord.com/channels/@me",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent": `Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_0) AppleWebKit/537.36 (KHTML, like Gecko) discord/0.0.263 Chrome/83.0.4103.122 Electron/9.3.5 Safari/537.36`,
      "x-debug-options": "bugReporterEnabled",
      "x-super-properties":
        "eyJvcyI6Ik1hYyBPUyBYIiwiYnJvd3NlciI6IkRpc2NvcmQgQ2xpZW50IiwicmVsZWFzZV9jaGFubmVsIjoic3RhYmxlIiwiY2xpZW50X3ZlcnNpb24iOiIwLjAuMjYzIiwib3NfdmVyc2lvbiI6IjIwLjUuMCIsIm9zX2FyY2giOiJ4NjQiLCJzeXN0ZW1fbG9jYWxlIjoiZW4tVVMiLCJjbGllbnRfYnVpbGRfbnVtYmVyIjo5MzQ1MiwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0=",
    };
  }

  async sendMessage(
    channelId: string,
    content: string
  ): Promise<Message | Error> {
    try {
      let res = await axios.post(
        `https://discord.com/api/v9/channels/${channelId}/messages`,
        {
          content,
        },
        { headers: this.headers }
      );
      return res.data;
    } catch (err) {
      return { error: err };
    }
  }

  async deleteMessage(
    channelId: string,
    messageId: string
  ): Promise<void | Error> {
    try {
      let res = await axios.delete(
        `https://discord.com/api/v9/channels/${channelId}/messages/${messageId}`,
        { headers: this.headers }
      );
    } catch (err) {
      return { error: err.response.data.message };
    }
  }

  async joinGuild(invite: string): Promise<void | Error> {
    try {
      console.log(this.headers);

      let res = await axios.post(
        `https://discord.com/api/v9/invites/${invite}`,
        undefined,
        { headers: this.headers }
      );
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  }

  static async sendWebhook(
    url: string,
    message: string | WebHook
  ): Promise<Object | Error> {
    try {
      if (typeof message === "object") {
        let res = await axios.post(url, message);
        return res.data;
      } else {
        let res = await axios.post(url, { content: message });
        return res.data;
      }
    } catch (err) {
      return { error: err };
    }
  }

  async getProfile() {
    try {
      let res = await axios.get(
        "https://discord.com/api/v9/users/816004387574251621/profile?with_mutual_guilds=false",
        { headers: this.headers }
      );
      return res.data;
    } catch (err) {
      return { error: err };
    }
  }

  static Gateway = class extends EventEmitter {
    token: string;
    interval: any;
    ws: WebSocket;
    payload: object;

    constructor(token: string) {
      super();
      this.token = token;
      this.ws = new WebSocket("wss://gateway.discord.gg/?v=6&encoding=json");
      this.payload = {
        op: 2,
        d: {
          token: this.token,
          properties: {
            $os: "linux",
            $browser: "chrome",
            $device: "chrome",
          },
        },
      };
      this.ws.on("open", () => {
        this.ws.send(JSON.stringify(this.payload));
      });

      this.ws.on("message", (data: string) => {
        let payload = JSON.parse(data);
        const { t, event, op, d } = payload;

        switch (op) {
          case 10:
            const { heartbeat_interval } = d;
            this.interval = this.heartbeat(heartbeat_interval);
            this.emit("ready");
            break;
        }

        switch (t) {
          case "MESSAGE_CREATE":
            // console.log(d);
            this.emit("message", d);
        }
      });
    }
    heartbeat = (ms: number) => {
      return setInterval(() => {
        this.ws.send(JSON.stringify({ op: 1, d: null }));
      }, ms);
    };
  };
}

export default Selfcore;
