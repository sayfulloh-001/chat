export interface QueueUser {
  socketId: string;
  userId: string;
  username: string;
  name: string;
  avatarUrl?: string;
  gender: string;
  country: string;
  countryCode: string;
  language: string;
  interests: string[];
  isPremium: boolean;
  isVerified: boolean;
  targetGender: string; // 'All', 'Male', 'Female'
  targetCountry: string; // 'Global' or country code
  joinedAt: number;
}

export interface ActiveRoom {
  roomId: string;
  user1: QueueUser;
  user2: QueueUser;
  startedAt: number;
}

export class MatchmakingService {
  private queue: QueueUser[] = [];
  private activeRooms: Map<string, ActiveRoom> = new Map();

  /**
   * Add a user to the waiting queue
   */
  public addToQueue(user: QueueUser): void {
    // Prevent duplicate entries
    this.removeFromQueue(user.socketId);
    this.queue.push(user);
    // Sort priority: Premium users first, then oldest wait time
    this.queue.sort((a, b) => {
      if (a.isPremium && !b.isPremium) return -1;
      if (!a.isPremium && b.isPremium) return 1;
      return a.joinedAt - b.joinedAt;
    });
  }

  /**
   * Remove user from queue
   */
  public removeFromQueue(socketId: string): void {
    this.queue = this.queue.filter((u) => u.socketId !== socketId);
  }

  /**
   * Attempt to find a match for a given waiting user
   */
  public findMatch(user: QueueUser): QueueUser | null {
    const candidates = this.queue.filter((other) => {
      if (other.socketId === user.socketId) return false;

      // Gender filter matching
      if (user.targetGender !== 'All' && other.gender !== user.targetGender) return false;
      if (other.targetGender !== 'All' && user.gender !== other.targetGender) return false;

      // Country filter matching if set
      if (user.targetCountry !== 'Global' && other.countryCode !== user.targetCountry) return false;
      if (other.targetCountry !== 'Global' && user.countryCode !== other.targetCountry) return false;

      return true;
    });

    if (candidates.length > 0) {
      // Pick first matching candidate
      const match = candidates[0];
      this.removeFromQueue(user.socketId);
      this.removeFromQueue(match.socketId);
      return match;
    }

    return null;
  }

  /**
   * Create an active room for matched pair
   */
  public createRoom(user1: QueueUser, user2: QueueUser): ActiveRoom {
    const roomId = `room_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const room: ActiveRoom = {
      roomId,
      user1,
      user2,
      startedAt: Date.now(),
    };
    this.activeRooms.set(roomId, room);
    return room;
  }

  /**
   * Close a room and return room info
   */
  public endRoom(roomId: string): ActiveRoom | undefined {
    const room = this.activeRooms.get(roomId);
    if (room) {
      this.activeRooms.delete(roomId);
    }
    return room;
  }

  /**
   * Find room by socket ID
   */
  public getRoomBySocketId(socketId: string): ActiveRoom | undefined {
    for (const room of this.activeRooms.values()) {
      if (room.user1.socketId === socketId || room.user2.socketId === socketId) {
        return room;
      }
    }
    return undefined;
  }

  /**
   * Return overall statistics
   */
  public getStats() {
    return {
      queueLength: this.queue.length,
      activeMatches: this.activeRooms.size,
      totalOnline: this.queue.length + this.activeRooms.size * 2 + 104200, // Dynamic high live count simulation
    };
  }

  public getActiveRoomsList(): ActiveRoom[] {
    return Array.from(this.activeRooms.values());
  }
}

export const matchmakingService = new MatchmakingService();
