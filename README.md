# ChatApp - Real-time Chat Application

A modern, full-featured chat application built with **React**, **Node.js**, **MongoDB**, and **Socket.IO**.

## Features

✨ **Core Features:**
- 🔐 User Authentication (Sign up, Login, Logout)
- 💬 Real-time Messaging with Socket.IO
- 👥 Online/Offline Status Indicators
- 🖼️ Profile Pictures with Cloudinary Integration
- 📱 Responsive Design (Mobile & Desktop)
- 🔍 User Search Functionality
- 🎨 Dark Mode Theme
- 🔔 Notification Settings
- ⚡ Real-time Message Delivery

## Tech Stack

### Frontend
- **React 19** - UI Framework
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Socket.IO Client** - Real-time Communication
- **Axios** - HTTP Client
- **React Router DOM** - Navigation
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.IO** - Real-time Communication
- **JWT** - Authentication
- **Bcryptjs** - Password Hashing
- **Cloudinary** - Image Hosting

## Project Structure

```
ChatApp/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── message.controller.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   └── message.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── messages.routes.js
│   │   ├── lib/
│   │   │   ├── db.js
│   │   │   └── cloudinary.js
│   │   ├── utils/
│   │   │   └── utils.js
│   │   └── index.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── SignupPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   └── SettingsPage.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── UserCard.jsx
    │   │   └── ChatBubble.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── SocketContext.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── lib/
    │   │   └── axios.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env.local
    └── package.json
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary Account (for image uploads)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file and configure:**
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/chatapp
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file:**
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Cloudinary Setup

1. **Sign up at [Cloudinary](https://cloudinary.com/)**
2. **Go to your Dashboard and copy:**
   - Cloud Name
   - API Key
   - API Secret
3. **Add these to your backend `.env` file**

## MongoDB Setup

### Option 1: Local MongoDB
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod
```

### Option 2: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get connection string
3. Use the connection string in `MONGO_URI`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/check` - Check authentication status
- `PUT /api/auth/update` - Update profile picture

### Messages
- `GET /api/messages/users` - Get all users
- `GET /api/messages/:id` - Get messages with specific user
- `POST /api/messages/send/:id` - Send message to user

## Socket.IO Events

### Client → Server
- `user_online` - User comes online
- `send_message` - Send message to other user

### Server → Client
- `user_status` - User online/offline status
- `new_message` - Receive new message
- `receive_message` - Message delivered

## Features Explained

### Authentication Flow
1. User signs up with email, password, and optional profile picture
2. Password is hashed with bcryptjs
3. JWT token is created and stored in HTTP-only cookie
4. User is automatically logged in after signup

### Real-time Messaging
1. When user sends a message, it's saved to MongoDB
2. Socket.IO event is emitted to receiver if online
3. Message appears instantly in receiver's chat
4. Online/offline status updates in real-time

### Profile Management
1. Users can upload profile pictures
2. Images are uploaded to Cloudinary
3. Profile picture URL is stored in MongoDB
4. Profile picture appears in chat and sidebar

## Usage

### Creating an Account
1. Click "Sign up" on the login page
2. Fill in Full Name, Email, and Password
3. Optionally upload a profile picture
4. Click "Create Account"

### Starting a Chat
1. Select a user from the sidebar
2. Type your message in the input field
3. Click Send or press Enter
4. Message appears instantly for both users

### Sending Images
1. Click the image icon in the message input
2. Select an image from your device
3. Preview will appear before sending
4. Click Send to share the image

### Managing Profile
1. Click the user icon in the navbar
2. Click the camera icon to change profile picture
3. Select a new image
4. Picture updates automatically

### Settings
1. Access Settings from the navbar
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
