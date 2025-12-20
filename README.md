# ChatApp - AI-Powered Real-Time Messaging Platform

A modern, feature-rich chat application built with React, Node.js, and Socket.IO, enhanced with advanced AI capabilities including sentiment analysis, message suggestions, and real-time translation.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)
![React](https://img.shields.io/badge/react-19.1.1-61dafb)

## 🎯 Overview

ChatApp is a full-stack real-time messaging application that combines traditional chat functionality with cutting-edge AI features. Users can send messages with real-time sentiment analysis, receive intelligent message suggestions, add emoji reactions, and more—all with seamless real-time synchronization across multiple clients.

## ✨ Key Features

### Core Messaging
- **Real-Time Messaging** - Instant message delivery via Socket.IO with zero-refresh experience
- **User Management** - Browse and select users from sidebar with online/offline status indicators
- **Message Search** - Advanced search with sentiment filtering and date range options
- **Image Sharing** - Upload and share images with message compression via Cloudinary

### AI Features
- **Sentiment Analysis** - Automatic emotion detection (positive/negative/neutral) on every message
- **Smart Suggestions** - Context-aware message suggestions while typing
- **Auto-Translation** - Translate messages to 100+ languages using MyMemory API
- **Message Analytics** - View statistics and insights about conversations

### User Experience
- **Typing Indicators** - See when users are typing in real-time
- **Read Receipts** - Track which users have read your messages
- **Emoji Reactions** - React to messages with 8 different emojis with instant updates
- **Soft Delete** - Delete messages with graceful UI updates
- **Group Chat** - Create and manage group conversations
- **Notifications** - Browser notifications and audio alerts for new messages

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 19.1.1 with Vite 7.2.2 for fast development
- Tailwind CSS v4 for responsive design
- Socket.IO Client 4.8.1 for real-time communication
- Lucide React for beautiful icons
- React Hot Toast for notifications
- Axios for HTTP requests

**Backend:**
- Node.js v22 with Express 5.1.0
## 🚀 Getting Started

### Prerequisites

- **Node.js** v22.0.0 or higher
- **MongoDB** v5.0 or higher (running locally on default port 27017)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ChatApp
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

### Configuration

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/chat-app

# Authentication
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### Running the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

Open your browser and navigate to `http://localhost:5173`

## 📱 Usage Guide

### User Authentication
1. **Sign Up** - Create a new account with full name, email, and password
2. **Log In** - Access your account with credentials
3. **Profile** - Update profile picture and view account details

### Sending Messages
1. Select a user from the sidebar
2. Type your message in the input field
3. **AI Suggestions** - Type 3+ characters to see smart suggestions
4. Click Send or press Enter
5. Message appears instantly with sentiment analysis

### AI Features

**Sentiment Analysis**
- Messages automatically analyzed for emotion
- Sentiment displayed as heart icon with label (Positive/Negative/Neutral)

**Smart Suggestions**
- Type "hello" → Get responses like "Hey! How are you?"
- Type "thank" → Get responses like "You're welcome!"
- Context-aware based on message content

**Message Reactions**
- Hover over any message
- Click emoji button (😊) to show reaction picker
- Select from 8 emojis to react
- View reaction counts and who reacted

**Message Search**
- Click search icon (🔍) in navbar
- Search by keywords, sentiment, or date range
- Find specific conversations instantly

**Typing Indicators**
- See when other users are typing
- Real-time status updates

**Read Receipts**
- Single checkmark = message sent
- Double checkmark = message read
- Hover to see who read the message

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login to existing account
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/check` - Check authentication status
- `PUT /api/auth/update` - Update profile picture

### Messaging
- `GET /api/messages/users` - Get sidebar user list
- `GET /api/messages/:id` - Get conversation messages
- `POST /api/messages/send/:id` - Send message (with sentiment analysis)
- `DELETE /api/messages/:messageId` - Delete message
- `PUT /api/messages/:messageId/read` - Mark message as read
- `PUT /api/messages/:messageId/react` - Add/remove emoji reaction

### AI Features
- `GET /api/messages/ai/suggestions?context=text` - Get smart suggestions
- `POST /api/messages/ai/translate` - Translate message
- `GET /api/messages/search/messages` - Search with filters
- `GET /api/messages/stats/analytics` - Get conversation analytics

## 🔌 Socket.IO Events

### Client → Server
- `user_online` - Register user as online
- `typing` - Emit typing status
- `send_message` - Send message via WebSocket
- `message_reaction` - Add/remove reaction

### Server → Client
- `user_status` - User online/offline status update
- `typing_status` - Other user typing status
- `receive_message` - New message received
- `reaction_update` - Reaction added/removed

## 🎨 UI Components

| Component | Purpose |
|-----------|---------|
| **ChatBubble** | Display individual messages with all interactions |
| **AISuggestions** | Context-aware dropdown suggestions |
| **TypingIndicator** | Animated "user is typing" display |
| **MessageReactions** | Emoji reaction picker and display |
| **ReadReceipts** | Show message read status with checkmarks |
| **SentimentIndicator** | Display emotion analysis with icon |
| **SearchMessages** | Modal for advanced message search |
| **Navbar** | Top navigation with user profile & settings |
| **UserCard** | User list item with online status |

## 📊 Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String (unique),
  password: String (hashed),
  profilePic: String,
  lastActiveAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Message Model
```javascript
{
  _id: ObjectId,
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  text: String,
  image: String,
  sentiment: String (positive|negative|neutral),
  sentimentScore: Number,
  reactions: [{
    userId: ObjectId,
    emoji: String
  }],
  readBy: [{
    userId: ObjectId,
    readAt: Date
  }],
  isDeleted: Boolean,
  translatedText: String,
  createdAt: Date,
  updatedAt: Date
}
```

## ⚙️ Maintenance & Features

### Auto-Cleanup
- Runs daily at 2 AM
- Removes deleted messages older than 30 days
- Clears old translations

### Sentiment Analysis
- Uses npm `sentiment` package (no API key needed)
- 3-point scale: positive/negative/neutral
- Real-time analysis on every message

### Translation
- Uses free MyMemory API
- Supports 100+ languages
- No API key or credentials required

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for password security
- **CORS Protection** - Restricted to frontend origin
- **Protected Routes** - All API endpoints require authentication
- **MongoDB Validation** - Schema-level data validation

## 📈 Performance Optimizations

- **Socket.IO** - Efficient WebSocket communication
- **Message Deduplication** - Prevents duplicate messages
- **Optimistic Updates** - Instant UI feedback
- **Lazy Loading** - Load messages on demand
- **Image Compression** - Cloudinary optimization
- **Auto-scrolling** - Smooth message list updates

## 🐛 Known Issues & Limitations

- Typing indicator shows user IDs (will be improved)
- Translation requires internet connection
- Search is case-sensitive (will be fixed)
- Group chat UI is placeholder (backend ready)

## 🚀 Future Enhancements

- [ ] Group messaging with multiple recipients
- [ ] Voice/video calls via WebRTC
- [ ] Message pinning and threading
- [ ] Advanced emoji picker with search
- [ ] Message scheduling
- [ ] End-to-end encryption
- [ ] Dark/Light theme toggle
- [ ] Mobile app (React Native)
- [ ] File sharing (documents, videos)
- [ ] User presence tracking with location

## 💾 Development Scripts

**Backend**
```bash
npm run dev      # Start with auto-reload (nodemon)
npm start        # Start production server
npm test         # Run tests (if configured)
```

**Frontend**
```bash
npm run dev      # Start dev server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📦 Dependencies

### Backend Key Packages
- `express` - Web framework
- `socket.io` - Real-time communication
- `mongoose` - MongoDB ODM
- `cloudinary` - Image hosting
- `sentiment` - Sentiment analysis
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `dotenv` - Environment variables

### Frontend Key Packages
- `react` - UI library
- `vite` - Build tool
- `socket.io-client` - WebSocket client
- `axios` - HTTP client
- `tailwindcss` - CSS framework
- `lucide-react` - Icon library
- `react-hot-toast` - Notifications

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👥 Author

**Aryan** - Full-stack developer

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact via email: [aryankhokhar022@gmail.com]

## 🎓 Learning Resources

- [Socket.IO Documentation](https://socket.io/docs/)
- [React Documentation](https://react.dev/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Express.js Guide](https://expressjs.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Made with ❤️ for real-time communication enthusiasts**

Last Updated: December 19, 2025
2. Toggle Dark Mode, Notifications, and Sounds
3. Settings are saved locally in your browser

## Development Notes

### State Management
- **Auth Context** - Manages user authentication and profile
- **Socket Context** - Manages Socket.IO connection and online users
- **Local State** - React hooks for component-level state

### Error Handling
- API errors are caught and displayed as toast notifications
- Network errors show user-friendly messages
- Form validation on both client and server

### Performance
- Messages are paginated (can be improved)
- Images are optimized by Cloudinary
- Socket.IO uses compression
- React components are memoized where needed

## Troubleshooting

### "Cannot find module" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGO_URI in `.env`
- Verify network access if using Atlas

### Image Upload Not Working
- Check Cloudinary credentials in `.env`
- Verify file size is under 5MB
- Check browser console for errors

### Socket.IO Connection Issues
- Ensure backend is running on port 5000
- Check firewall settings
- Verify VITE_API_URL is correct in frontend `.env`

## Deployment

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy from GitHub
3. Ensure MongoDB Atlas connection

### Frontend (Vercel)
1. Update VITE_API_URL to production backend
2. Deploy from GitHub
3. Set environment variables in Vercel

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please create an issue in the repository.

---

Made with ❤️ by Aryan
