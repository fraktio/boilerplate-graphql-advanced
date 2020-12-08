import Logger from "bunyan";
import { Server } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

/*

If you want to use socket.io with this app add these to server.ts

import { createSocketIO } from "~/socketIO";

const server = http.createServer(app);
createSocketIO({ server, logger });

*/

enum EventType {
  CONNECTION = "connection",
  MESSAGE = "message",
}

export class SocketIOInstance extends SocketIOServer {
  protected logger: Logger;

  constructor(opts: { server: Server; logger: Logger }) {
    super(opts.server);
    this.logger = opts.logger;
    this.on(EventType.CONNECTION, this.handleConnection);
  }

  private handleConnection(socket: Socket) {
    socket.on(EventType.MESSAGE, (data) => {
      socket.emit(EventType.MESSAGE, data);
    });
  }
}

export const createSocketIO = (opts: { server: Server; logger: Logger }) =>
  new SocketIOInstance(opts);
