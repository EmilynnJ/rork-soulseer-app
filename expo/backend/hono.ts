import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

const app = new Hono();

app.use("*", cors());

app.all("/api/trpc/*", async (c) => {
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext: ({ req }) => createContext({ req }),
  });
  return response;
});

const ADMIN_EMAIL = "emilynnj14@gmail.com";
const ADMIN_PASSWORD = "Jade2014!";

const USERS_DB: Record<string, { id: string; email: string; password: string; name: string; role: 'client' | 'reader' | 'admin'; avatar: string; balance: number; readerId?: string }> = {
  "emilynnj14@gmail.com": {
    id: "admin-1",
    email: "emilynnj14@gmail.com",
    password: "Jade2014!",
    name: "Admin",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&fit=crop",
    balance: 0,
  },
  "emilynn992@gmail.com": {
    id: "reader-emilynn",
    email: "emilynn992@gmail.com",
    password: "Jade2014!",
    name: "Emilynn",
    role: "reader",
    avatar: "https://i.postimg.cc/s2ds9RtC/FOUNDER.jpg",
    balance: 0,
    readerId: "reader-emilynn",
  },
};

const mockReaders = [
  {
    id: "reader-emilynn",
    name: "Emilynn",
    avatar: "https://i.postimg.cc/s2ds9RtC/FOUNDER.jpg",
    specialty: "Psychic Medium & Founder",
    rating: 5.0,
    reviewCount: 512,
    pricePerMin: 6.99,
    pricePerMinChat: 5.99,
    pricePerMinVoice: 6.99,
    pricePerMinVideo: 8.99,
    isOnline: true,
    bio: "Founder of SoulSeer and experienced psychic medium. I created this platform to provide ethical, compassionate, and judgment-free spiritual guidance.",
    skills: ["Psychic Medium", "Tarot", "Clairvoyance", "Energy Reading"],
    languages: ["English"],
    totalReadings: 4200,
  },
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
    description: "A beautiful 78-card tarot deck with ethereal artwork.",
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
    description: "Seven chakra crystals with a velvet pouch and guidebook.",
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
    description: "A comprehensive digital guide to spiritual meditation.",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&fit=crop",
    category: "digital",
    rating: 4.7,
    reviewCount: 234,
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
];

app.get("/api/readers/online", (c) => {
  const onlineReaders = mockReaders.filter(r => r.isOnline);
  return c.json({ data: onlineReaders, success: true });
});

app.get("/api/readers", (c) => {
  return c.json({ data: mockReaders, success: true });
});

app.get("/api/readers/:id", (c) => {
  const id = c.req.param("id");
  const reader = mockReaders.find(r => r.id === id);
  if (reader) {
    return c.json({ data: reader, success: true });
  }
  return c.json({ data: null, success: false, error: "Reader not found" }, 404);
});

app.get("/api/streams/live", (c) => {
  return c.json({ data: mockStreams, success: true });
});

app.get("/api/streams/:id", (c) => {
  const id = c.req.param("id");
  const stream = mockStreams.find(s => s.id === id);
  if (stream) {
    return c.json({ data: stream, success: true });
  }
  return c.json({ data: null, success: false, error: "Stream not found" }, 404);
});

app.get("/api/products", (c) => {
  const category = c.req.query("category");
  const products = category 
    ? mockProducts.filter(p => p.category === category)
    : mockProducts;
  return c.json({ data: products, success: true });
});

app.get("/api/community/posts", (c) => {
  const limitStr = c.req.query("limit");
  const limit = limitStr ? parseInt(limitStr, 10) : mockCommunityPosts.length;
  return c.json({ data: mockCommunityPosts.slice(0, limit), success: true });
});

app.get("/api/messages/:userId", (c) => {
  return c.json({ data: [], success: true });
});

app.post("/api/auth/login", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;
    
    const user = USERS_DB[email.toLowerCase()];
    
    if (!user || user.password !== password) {
      return c.json({ success: false, error: "Invalid email or password" }, 401);
    }
    
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    return c.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          balance: user.balance,
          createdAt: new Date().toISOString(),
          readerId: user.readerId,
        },
        token: sessionToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ success: false, error: "Login failed" }, 500);
  }
});

app.post("/api/auth/register", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;
    
    const existingUser = USERS_DB[email.toLowerCase()];
    if (existingUser) {
      if (existingUser.password === password) {
        const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        return c.json({
          success: true,
          data: {
            user: {
              id: existingUser.id,
              name: existingUser.name,
              email: existingUser.email,
              role: existingUser.role,
              avatar: existingUser.avatar,
              balance: existingUser.balance,
              createdAt: new Date().toISOString(),
              readerId: existingUser.readerId,
            },
            token: sessionToken,
          },
        });
      }
      return c.json({ success: false, error: "Email already registered. Please log in instead." }, 400);
    }
    
    const newUser = {
      id: `user-${Date.now()}`,
      email: email.toLowerCase(),
      password,
      name,
      role: "client" as const,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&fit=crop",
      balance: 0,
    };
    
    USERS_DB[email.toLowerCase()] = newUser;
    
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    return c.json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          avatar: newUser.avatar,
          balance: newUser.balance,
          createdAt: new Date().toISOString(),
        },
        token: sessionToken,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return c.json({ success: false, error: "Registration failed" }, 500);
  }
});

app.get("/api/auth/me", (c) => {
  const authHeader = c.req.header("Authorization");
  
  if (!authHeader) {
    return c.json({ 
      data: null,
      success: false,
      error: "Not authenticated"
    }, 401);
  }
  
  return c.json({ 
    data: {
      id: "user-1",
      name: "Guest User",
      email: "guest@soulseer.com",
      role: "client",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&fit=crop",
      balance: 50.00,
      createdAt: new Date().toISOString(),
    }, 
    success: true 
  });
});

app.get("/api/readers/:id/earnings", (c) => {
  return c.json({ 
    data: {
      todayEarnings: 125.50,
      pendingPayout: 450.00,
      totalEarnings: 12500.00,
      sessionsToday: 8,
    }, 
    success: true 
  });
});

app.get("/api/users/:userId/transactions", (c) => {
  return c.json({ data: [], success: true });
});

app.post("/api/payments/add-funds", async (c) => {
  const body = await c.req.json();
  return c.json({ 
    data: {
      id: `txn-${Date.now()}`,
      userId: body.userId,
      amount: body.amount,
      type: "credit",
      description: "Added funds",
      timestamp: new Date().toISOString(),
      status: "completed",
    }, 
    success: true 
  });
});

app.put("/api/readers/status", async (c) => {
  return c.json({ success: true });
});

app.post("/api/newsletter/subscribe", async (c) => {
  return c.json({ success: true, message: "Subscribed successfully" });
});

app.get("/api", (c) => {
  return c.json({ status: "ok", message: "SoulSeer API is running" });
});

export default app;
