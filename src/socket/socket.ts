import SocketIO, { Server as SocketIOServer } from "socket.io";

/**
 * @class Socket
 *
 * @property  {io}
 *
 * @method    emitProfileDeleted      {@link Socket#emitProfileDeleted}
 * @method    handle                  {@link Socket#handle}
 * @method    handleProfileDeleted    {@link Socket#handleProfileDeleted}
 */
class Socket {
  /**
   * @var {SocketIOServer} The SocketIO object to handle everything
   */
  private io: SocketIOServer;

  /**
   * @param {SocketIOServer} io
   */
  constructor(io: SocketIOServer) {
    this.io = io;
  }

  /**
   * @method emitProfileDeleted
   *
   * @description
   * Send a message to all clients that a profile was deleted, so they can remove it form the dom
   *
   * @example
   * this.emitProfileDeleted(socket, profileId)
   *
   * @param {SocketIO.Socket} socket The socket object
   * @param {number} profileId The id of the profile that was deleted
   */
  private emitProfileDeleted(socket: SocketIO.Socket, profileId: number): void {
    socket.broadcast.emit("profileDeleted", {
      profileId: profileId,
    });
  }

  /**
   * @method handleProfileDeleted
   *
   * @description
   * Event listener for when a profile is deleted
   *
   * @param {SocketIO.Socket}   socket      The socket object
   * @param {number}            profileId   Profile id that was deleted
   */
  private handleProfileDeleted(
    socket: SocketIO.Socket,
    profileId: number
  ): void {
    this.emitProfileDeleted(socket, profileId);
  }

  /**
   * @description
   * The entry point for handling all events and connections
   *
   * @return {void}
   */
  public handle(): void {
    this.io.on("connection", (socket: SocketIO.Socket) => {
      // Answer the call request
      socket.on("profileDeleted", (data: { profileId: number }) => {
        this.handleProfileDeleted(socket, data.profileId);
      });
    });
  }

  public close(): void {
    this.io.close();
  }
}

export default Socket;
