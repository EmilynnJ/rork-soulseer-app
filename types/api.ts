export interface Reader {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  pricePerMin: number;
  pricePerMinChat?: number;
  pricePerMinVoice?: number;
  pricePerMinVideo?: number;
  isOnline: boolean;
  avatar: string;
  bio?: string;
  skills?: string[];
  languages?: string[];
  totalReadings?: number;
}

export interface LiveStream {
  id: string;
  readerId: string;
  readerName: string;
  title: string;
  viewers: number;
  thumbnail: string;
  startedAt: string;
  isLive: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviewCount?: number;
  category: string;
  description?: string;
  inStock: boolean;
}

export interface CommunityPost {
  id: string;
  title: string;
  content?: string;
  author: string;
  authorId?: string;
  authorAvatar?: string;
  comments: number;
  likes: number;
  image?: string;
  createdAt: string;
  tag?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'reader' | 'admin';
  avatar: string;
  balance: number;
  createdAt: string;
}

export interface ReadingSession {
  id: string;
  readerId: string;
  clientId: string;
  sessionType: 'chat' | 'audio' | 'video';
  startTime: string;
  endTime?: string;
  totalMinutes: number;
  amountCharged: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'credit' | 'debit' | 'refund';
  description: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface ReaderEarnings {
  todayEarnings: number;
  pendingPayout: number;
  totalEarnings: number;
  sessionsToday: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
