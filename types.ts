export interface User {
  _id: string;
  email: string;
  username: string;
  phone: string;
  role: string;
  friends?: string[]; // array of user IDs
  friendRequests?: FriendRequest[];
}

export type FriendRequest = {
  from: User;
  createdAt: string;
};
