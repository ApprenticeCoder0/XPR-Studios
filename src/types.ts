export enum UserRole {
  GUEST = 0,
  USER = 1,
  PARTNERSHIP = 2,
  STAFF_INITIATE = 3,
  STAFF_SENIOR = 4,
  STAFF_EXECUTIVE = 5,
  STAFF_HEAD = 6,
  ADMIN = 7,
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
  bio?: string;
  badges?: string[];
}

export enum TicketSituation {
  NOT_VISUALIZED = "Not visualized",
  VISUALIZED = "Visualized",
  PENDING = "Pending",
  COMMUNICATION_PHASE = "Communication Phase",
  STAFF_DISCUSSION = "Staff Discussion",
  RESOLVED = "Resolved",
}

export enum TicketGrade {
  NOT_VERY_IMPORTANT = "Not Very Important",
  NORMAL = "Normal",
  POTENTIALLY_IMPORTANT = "Potentially Important",
  URGENT = "Urgent",
}

export enum TicketTime {
  VERY_EARLY = "Very Early",
  NORMAL_TIME = "Normal Time",
  TOO_LATE = "Too Late",
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  authorId: string;
  category: string;
  createdAt: string;
  situation: TicketSituation;
  grade: TicketGrade;
  time: TicketTime;
}
