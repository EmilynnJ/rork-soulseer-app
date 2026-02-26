import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";

const mockReaders = [
  {
    id: "reader-1",
    name: "Luna Starweaver",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&fit=crop",
    specialty: "Tarot & Intuitive",
    rating: 4.9,
    reviewCount: 328,
    pricePerMin: 5.99,
    pricePerMinChat: 4.99,
    pricePerMinVoice: 5.99,
    pricePerMinVideo: 7.99,
    isOnline: true,
    bio: "With over 15 years of experience, I connect deeply with the spiritual realm to provide guidance on love, career, and life path.",
    skills: ["Tarot", "Clairvoyance", "Love Readings"],
    languages: ["English", "Spanish"],
    totalReadings: 2450,
  },
  {
    id: "reader-2",
    name: "Mystic Rose",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&fit=crop",
    specialty: "Medium & Clairvoyant",
    rating: 4.8,
    reviewCount: 256,
    pricePerMin: 6.99,
    pricePerMinChat: 5.99,
    pricePerMinVoice: 6.99,
    pricePerMinVideo: 8.99,
    isOnline: true,
    bio: "I bridge the gap between the physical and spiritual worlds, helping you connect with loved ones who have passed.",
    skills: ["Mediumship", "Spirit Communication", "Energy Healing"],
    languages: ["English"],
    totalReadings: 1820,
  },
  {
    id: "reader-3",
    name: "Crystal Dreams",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop",
    specialty: "Astrology Expert",
    rating: 4.7,
    reviewCount: 189,
    pricePerMin: 4.99,
    pricePerMinChat: 3.99,
    pricePerMinVoice: 4.99,
    pricePerMinVideo: 6.99,
    isOnline: true,
    bio: "Let the stars guide your journey. I provide detailed birth chart readings and astrological forecasts.",
    skills: ["Astrology", "Birth Charts", "Compatibility"],
    languages: ["English", "French"],
    totalReadings: 1340,
  },
  {
    id: "reader-4",
    name: "Sage Moonlight",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop",
    specialty: "Energy Healer",
    rating: 4.9,
    reviewCount: 412,
    pricePerMin: 7.99,
    pricePerMinChat: 6.99,
    pricePerMinVoice: 7.99,
    pricePerMinVideo: 9.99,
    isOnline: true,
    bio: "I channel healing energy to help you overcome obstacles and find inner peace on your spiritual journey.",
    skills: ["Reiki", "Chakra Balancing", "Aura Reading"],
    languages: ["English"],
    totalReadings: 3100,
  },
  {
    id: "reader-5",
    name: "Aurora Visions",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&fit=crop",
    specialty: "Dream Interpreter",
    rating: 4.6,
    reviewCount: 145,
    pricePerMin: 4.49,
    pricePerMinChat: 3.49,
    pricePerMinVoice: 4.49,
    pricePerMinVideo: 5.99,
    isOnline: false,
    bio: "Your dreams hold powerful messages. Let me help you unlock their hidden meanings and guidance.",
    skills: ["Dream Analysis", "Symbolism", "Past Life"],
    languages: ["English", "Italian"],
    totalReadings: 890,
  },
];

const mockStreams = [
  {
    id: "stream-1",
    readerId: "reader-1",
    readerName: "Luna Starweaver",
    title: "Full Moon Tarot Guidance",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&fit=crop",
    viewers: 127,
    isLive: true,
    startedAt: new Date().toISOString(),
  },
  {
    id: "stream-2",
    readerId: "reader-2",
    readerName: "Mystic Rose",
    title: "Spirit Messages Tonight",
    thumbnail: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&fit=crop",
    viewers: 89,
    isLive: true,
    startedAt: new Date().toISOString(),
  },
  {
    id: "stream-3",
    readerId: "reader-4",
    readerName: "Sage Moonlight",
    title: "Chakra Healing Session",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&fit=crop",
    viewers: 203,
    isLive: true,
    startedAt: new Date().toISOString(),
  },
];

const mockProducts = [
  {
    id: "product-1",
    name: "Mystic Tarot Deck",
    description: "A beautiful 78-card tarot deck with ethereal artwork, perfect for beginners and experienced readers.",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1601370690183-1c7796ecec61?w=600&fit=crop",
    category: "physical",
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
  },
  {
    id: "product-2",
    name: "Crystal Healing Set",
    description: "Seven chakra crystals with a velvet pouch and guidebook for energy healing practices.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1567225477277-c8162eb4991d?w=600&fit=crop",
    category: "physical",
    rating: 4.9,
    reviewCount: 89,
    inStock: true,
  },
  {
    id: "product-3",
    name: "Meditation Guide eBook",
    description: "A comprehensive digital guide to spiritual meditation with 30 guided sessions.",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&fit=crop",
    category: "digital",
    rating: 4.7,
    reviewCount: 234,
    inStock: true,
  },
  {
    id: "product-4",
    name: "Sage Smudge Bundle",
    description: "Organic white sage bundle for cleansing and purifying your space of negative energies.",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1600298882525-84ac9ef8b456?w=600&fit=crop",
    category: "physical",
    rating: 4.6,
    reviewCount: 312,
    inStock: true,
  },
  {
    id: "product-5",
    name: "Birth Chart Reading",
    description: "Detailed personalized astrology report based on your exact birth time and location.",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1532968961962-8a0ff256bdb2?w=600&fit=crop",
    category: "service",
    rating: 4.9,
    reviewCount: 178,
    inStock: true,
  },
];

const mockCommunityPosts = [
  {
    id: "post-1",
    title: "My First Tarot Experience Changed My Life",
    content: "I was skeptical at first, but my reading with Luna was incredible...",
    author: "Sarah M.",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&fit=crop",
    image: "https://images.unsplash.com/photo-1601370690183-1c7796ecec61?w=800&fit=crop",
    likes: 234,
    comments: 45,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "post-2",
    title: "Understanding Your Aura Colors",
    content: "Learn what different aura colors mean and how to interpret them...",
    author: "Mystic Rose",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&fit=crop",
    image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&fit=crop",
    likes: 567,
    comments: 89,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "post-3",
    title: "Full Moon Rituals for Manifestation",
    content: "The full moon is a powerful time for setting intentions...",
    author: "Crystal Dreams",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop",
    image: "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=800&fit=crop",
    likes: 892,
    comments: 156,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "post-4",
    title: "Connecting with Spirit Guides",
    content: "Everyone has spirit guides watching over them. Here's how to connect...",
    author: "Sage Moonlight",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&fit=crop",
    likes: 445,
    comments: 78,
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
];

export const readersRouter = createTRPCRouter({
  getOnline: publicProcedure.query(async () => {
    return mockReaders.filter(r => r.isOnline);
  }),
  
  getAll: publicProcedure.query(async () => {
    return mockReaders;
  }),
  
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return mockReaders.find(r => r.id === input.id) || null;
    }),
});

export const streamsRouter = createTRPCRouter({
  getLive: publicProcedure.query(async () => {
    return mockStreams;
  }),
  
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return mockStreams.find(s => s.id === input.id) || null;
    }),
});

export const productsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ category: z.string().optional() }).optional())
    .query(async ({ input }) => {
      if (input?.category) {
        return mockProducts.filter(p => p.category === input.category);
      }
      return mockProducts;
    }),
    
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return mockProducts.find(p => p.id === input.id) || null;
    }),
});

export const communityRouter = createTRPCRouter({
  getPosts: publicProcedure
    .input(z.object({ limit: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const limit = input?.limit || mockCommunityPosts.length;
      return mockCommunityPosts.slice(0, limit);
    }),
    
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return mockCommunityPosts.find(p => p.id === input.id) || null;
    }),
});

export const newsletterRouter = createTRPCRouter({
  subscribe: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      console.log('Newsletter subscription:', input.email);
      return { success: true, message: 'Successfully subscribed to newsletter!' };
    }),
});

const mockUsers = [
  {
    id: 'admin-1',
    name: 'Admin',
    email: 'emilynnj14@gmail.com',
    role: 'admin' as const,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&fit=crop',
    balance: 0,
    createdAt: '2024-01-01T00:00:00.000Z',
    status: 'active' as const,
  },
  {
    id: 'reader-emilynn',
    name: 'Emilynn',
    email: 'emilynn992@gmail.com',
    role: 'reader' as const,
    avatar: 'https://i.postimg.cc/s2ds9RtC/FOUNDER.jpg',
    balance: 0,
    createdAt: '2024-01-15T00:00:00.000Z',
    status: 'active' as const,
  },
  {
    id: 'user-1',
    name: 'Sarah Mitchell',
    email: 'sarah.m@example.com',
    role: 'client' as const,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&fit=crop',
    balance: 75.00,
    createdAt: '2024-03-10T00:00:00.000Z',
    status: 'active' as const,
  },
  {
    id: 'user-2',
    name: 'James Wilson',
    email: 'james.w@example.com',
    role: 'client' as const,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop',
    balance: 120.50,
    createdAt: '2024-04-22T00:00:00.000Z',
    status: 'active' as const,
  },
  {
    id: 'user-3',
    name: 'Maria Garcia',
    email: 'maria.g@example.com',
    role: 'client' as const,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop',
    balance: 30.00,
    createdAt: '2024-05-05T00:00:00.000Z',
    status: 'active' as const,
  },
];

const mockTransactions = [
  {
    id: 'txn-1',
    userId: 'user-1',
    amount: 50.00,
    type: 'credit' as const,
    description: 'Added funds via Stripe',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'completed' as const,
  },
  {
    id: 'txn-2',
    userId: 'user-1',
    amount: 17.97,
    type: 'debit' as const,
    description: 'Reading with Luna Starweaver (3 min)',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    status: 'completed' as const,
  },
  {
    id: 'txn-3',
    userId: 'user-2',
    amount: 100.00,
    type: 'credit' as const,
    description: 'Added funds via Stripe',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    status: 'completed' as const,
  },
  {
    id: 'txn-4',
    userId: 'user-2',
    amount: 29.95,
    type: 'debit' as const,
    description: 'Reading with Mystic Rose (5 min)',
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    status: 'completed' as const,
  },
];

const mockReadingSessions = [
  {
    id: 'session-1',
    readerId: 'reader-1',
    readerName: 'Luna Starweaver',
    clientId: 'user-1',
    clientName: 'Sarah Mitchell',
    sessionType: 'video' as const,
    startTime: new Date(Date.now() - 86400000).toISOString(),
    endTime: new Date(Date.now() - 86400000 + 1800000).toISOString(),
    totalMinutes: 30,
    amountCharged: 179.70,
    status: 'completed' as const,
  },
  {
    id: 'session-2',
    readerId: 'reader-2',
    readerName: 'Mystic Rose',
    clientId: 'user-2',
    clientName: 'James Wilson',
    sessionType: 'chat' as const,
    startTime: new Date(Date.now() - 172800000).toISOString(),
    endTime: new Date(Date.now() - 172800000 + 900000).toISOString(),
    totalMinutes: 15,
    amountCharged: 89.85,
    status: 'completed' as const,
  },
  {
    id: 'session-3',
    readerId: 'reader-emilynn',
    readerName: 'Emilynn',
    clientId: 'user-3',
    clientName: 'Maria Garcia',
    sessionType: 'audio' as const,
    startTime: new Date(Date.now() - 3600000).toISOString(),
    endTime: new Date(Date.now() - 3600000 + 1200000).toISOString(),
    totalMinutes: 20,
    amountCharged: 139.80,
    status: 'completed' as const,
  },
];

export const adminRouter = createTRPCRouter({
  getStats: publicProcedure.query(async () => {
    const totalUsers = mockUsers.length;
    const activeReaders = mockReaders.filter(r => r.isOnline).length;
    const totalRevenue = mockTransactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalSessions = mockReadingSessions.length;
    const todayRevenue = mockTransactions
      .filter(t => t.type === 'debit' && new Date(t.timestamp).toDateString() === new Date().toDateString())
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalUsers,
      activeReaders,
      totalReaders: mockReaders.length,
      totalRevenue,
      todayRevenue,
      totalSessions,
      monthlyRevenue: totalRevenue * 4.2,
      pendingPayouts: 1250.00,
      totalProducts: mockProducts.length,
      totalPosts: mockCommunityPosts.length,
    };
  }),

  getUsers: publicProcedure
    .input(z.object({ role: z.string().optional(), limit: z.number().optional() }).optional())
    .query(async ({ input }) => {
      let users = mockUsers;
      if (input?.role) {
        users = users.filter(u => u.role === input.role);
      }
      if (input?.limit) {
        users = users.slice(0, input.limit);
      }
      return users;
    }),

  getSessions: publicProcedure
    .input(z.object({ limit: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const limit = input?.limit || mockReadingSessions.length;
      return mockReadingSessions.slice(0, limit);
    }),

  getTransactions: publicProcedure
    .input(z.object({ userId: z.string().optional(), limit: z.number().optional() }).optional())
    .query(async ({ input }) => {
      let txns = mockTransactions;
      if (input?.userId) {
        txns = txns.filter(t => t.userId === input.userId);
      }
      if (input?.limit) {
        txns = txns.slice(0, input.limit);
      }
      return txns;
    }),

  getRevenueReport: publicProcedure.query(async () => {
    return {
      daily: [
        { date: new Date(Date.now() - 6 * 86400000).toISOString(), revenue: 245.50, sessions: 12 },
        { date: new Date(Date.now() - 5 * 86400000).toISOString(), revenue: 389.20, sessions: 18 },
        { date: new Date(Date.now() - 4 * 86400000).toISOString(), revenue: 178.90, sessions: 9 },
        { date: new Date(Date.now() - 3 * 86400000).toISOString(), revenue: 512.40, sessions: 24 },
        { date: new Date(Date.now() - 2 * 86400000).toISOString(), revenue: 295.70, sessions: 15 },
        { date: new Date(Date.now() - 86400000).toISOString(), revenue: 421.30, sessions: 20 },
        { date: new Date().toISOString(), revenue: 167.80, sessions: 8 },
      ],
      totalWeekly: 2210.80,
      totalMonthly: 8842.00,
    };
  }),
});

export const readerDashboardRouter = createTRPCRouter({
  getEarnings: publicProcedure
    .input(z.object({ readerId: z.string() }))
    .query(async ({ input }) => {
      const readerSessions = mockReadingSessions.filter(s => s.readerId === input.readerId);
      const todayEarnings = readerSessions
        .filter(s => new Date(s.startTime).toDateString() === new Date().toDateString())
        .reduce((sum, s) => sum + s.amountCharged * 0.7, 0);
      const totalEarnings = readerSessions.reduce((sum, s) => sum + s.amountCharged * 0.7, 0);

      return {
        todayEarnings: todayEarnings || 125.50,
        pendingPayout: 450.00,
        totalEarnings: totalEarnings || 12500.00,
        sessionsToday: readerSessions.filter(s => new Date(s.startTime).toDateString() === new Date().toDateString()).length || 8,
        weeklyEarnings: 875.30,
        monthlyEarnings: 3420.00,
        totalSessions: readerSessions.length || 42,
        averageRating: 4.8,
        completionRate: 97,
      };
    }),

  getSessions: publicProcedure
    .input(z.object({ readerId: z.string(), limit: z.number().optional() }))
    .query(async ({ input }) => {
      let sessions = mockReadingSessions.filter(s => s.readerId === input.readerId);
      if (input.limit) {
        sessions = sessions.slice(0, input.limit);
      }
      return sessions;
    }),

  getSchedule: publicProcedure
    .input(z.object({ readerId: z.string() }))
    .query(async () => {
      return [
        { id: 'appt-1', clientName: 'Sarah Mitchell', sessionType: 'video', scheduledAt: new Date(Date.now() + 3600000).toISOString(), duration: 30 },
        { id: 'appt-2', clientName: 'James Wilson', sessionType: 'chat', scheduledAt: new Date(Date.now() + 7200000).toISOString(), duration: 15 },
        { id: 'appt-3', clientName: 'Maria Garcia', sessionType: 'audio', scheduledAt: new Date(Date.now() + 86400000).toISOString(), duration: 45 },
      ];
    }),
});

export const clientDashboardRouter = createTRPCRouter({
  getBalance: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const user = mockUsers.find(u => u.id === input.userId);
      return { balance: user?.balance || 50.00 };
    }),

  getUpcomingReadings: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async () => {
      return [
        { id: 'upcoming-1', readerName: 'Luna Starweaver', readerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&fit=crop', sessionType: 'video', scheduledAt: new Date(Date.now() + 86400000).toISOString(), duration: 30, pricePerMin: 7.99 },
        { id: 'upcoming-2', readerName: 'Crystal Dreams', readerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop', sessionType: 'chat', scheduledAt: new Date(Date.now() + 172800000).toISOString(), duration: 15, pricePerMin: 3.99 },
      ];
    }),

  getReadingHistory: publicProcedure
    .input(z.object({ userId: z.string(), limit: z.number().optional() }))
    .query(async ({ input }) => {
      const sessions = mockReadingSessions.filter(s => s.clientId === input.userId);
      return input.limit ? sessions.slice(0, input.limit) : sessions;
    }),

  getTransactions: publicProcedure
    .input(z.object({ userId: z.string(), limit: z.number().optional() }))
    .query(async ({ input }) => {
      let txns = mockTransactions.filter(t => t.userId === input.userId);
      if (input.limit) {
        txns = txns.slice(0, input.limit);
      }
      return txns;
    }),

  getFavoriteReaders: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async () => {
      return mockReaders.slice(0, 3);
    }),
});
