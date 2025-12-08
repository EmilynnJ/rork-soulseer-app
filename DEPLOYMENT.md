# SoulSeer - Production Deployment Guide

## Pre-Deployment Checklist

### Backend Requirements
- [ ] Backend API is deployed and accessible
- [ ] All required API endpoints are implemented (see API section)
- [ ] Authentication system is configured
- [ ] Stripe Connect is set up for payments
- [ ] WebRTC signaling server is deployed
- [ ] Database is configured (recommended: PostgreSQL/Neon)

### App Configuration
- [ ] Update `EXPO_PUBLIC_API_URL` in environment variables
- [ ] Configure authentication provider credentials
- [ ] Set up Stripe publishable key
- [ ] Configure WebRTC TURN/STUN servers
- [ ] Set up error tracking (Sentry or similar)
- [ ] Configure analytics (if required)

### Testing
- [ ] All screens load without errors
- [ ] Data fetching works correctly with production API
- [ ] Error boundaries catch and display errors properly
- [ ] Loading states appear correctly
- [ ] Empty states display when no data is available
- [ ] Authentication flow works end-to-end
- [ ] Payment integration is functional

### Content
- [ ] App name is correct (SoulSeer)
- [ ] Hero images are loading (from postimg.cc)
- [ ] Icon and splash screen are configured
- [ ] All required fonts are loaded (Alex Brush, Playfair Display)

## Required API Endpoints

### Authentication
\`\`\`
GET /auth/me
Response: { id, name, email, role, avatar, balance, createdAt }
\`\`\`

### Readers
\`\`\`
GET /readers - Get all readers
GET /readers/online - Get online readers only
GET /readers/:id - Get specific reader
PUT /readers/status - Update reader online/offline status
GET /readers/:id/earnings - Get reader earnings data
\`\`\`

### Live Streams
\`\`\`
GET /streams/live - Get currently live streams
\`\`\`

### Products
\`\`\`
GET /products?category={category} - Get products (optional category filter)
\`\`\`

### Community
\`\`\`
GET /community/posts?limit={limit} - Get community posts
\`\`\`

### Messages
\`\`\`
GET /messages/:userId - Get messages for a user
\`\`\`

### Payments
\`\`\`
POST /payments/add-funds
Body: { userId, amount }
Response: Transaction object
\`\`\`

### Newsletter
\`\`\`
POST /newsletter/subscribe
Body: { email }
\`\`\`

### Transactions
\`\`\`
GET /users/:userId/transactions?limit={limit} - Get user transaction history
\`\`\`

## Environment Variables

Create a `.env` file with:

\`\`\`env
EXPO_PUBLIC_API_URL=https://api.soulseer.app
\`\`\`

## Data Requirements

All API responses should follow the TypeScript types defined in `types/api.ts`:

- **Reader**: id, name, specialty, rating, reviews, pricePerMin, isOnline, avatar, description
- **LiveStream**: id, readerId, readerName, title, viewers, thumbnail, startedAt, isLive
- **Product**: id, name, price, image, rating, category, description, inStock
- **CommunityPost**: id, title, author, authorId, comments, likes, image, createdAt, tag
- **Message**: id, senderId, senderName, senderAvatar, lastMessage, timestamp, unread
- **User**: id, name, email, role, avatar, balance, createdAt

## Known Limitations

- WebRTC session screen has basic UI but requires full WebRTC implementation
- Admin dashboard is not fully implemented
- Payment processing requires backend Stripe integration
- Real-time features need WebSocket or similar implementation

## Troubleshooting

### "No data available" messages
- Verify backend API is accessible
- Check network requests in console
- Ensure API returns data in correct format

### Authentication errors
- Verify `/auth/me` endpoint returns valid user data
- Check authentication token is being sent correctly

### Images not loading
- Verify hero image URLs are accessible
- Check reader avatars are valid URLs

## Security Notes

- All API calls should be authenticated
- Stripe keys should be environment variables
- User tokens should be stored securely
- WebRTC sessions should be encrypted

## Support

For deployment issues, contact the backend development team or Expo support.
