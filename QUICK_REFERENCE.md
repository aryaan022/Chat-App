# ChatApp - Quick Reference Card

## 🚀 Start the App (5 Minutes)

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
✅ Should see: "Server is running on port 5000"

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
✅ Should see: Open http://localhost:5173

---

## 🔧 Required Setup (First Time Only)

### 1. MongoDB
- **Local**: Download from mongodb.com, start `mongod`
- **Cloud**: Create cluster at mongodb.com/atlas, get connection string

### 2. Cloudinary
- Sign up at cloudinary.com
- Copy Cloud Name, API Key, API Secret
- Add to `backend/.env`

### 3. Backend .env
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=any_random_secret_key
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### 4. Frontend .env.local
```
VITE_API_URL=http://localhost:5000/api
```

---

## 📱 Using the App

| Feature | How |
|---------|-----|
| **Sign Up** | Email + Password + (Optional) Profile Pic |
| **Login** | Email + Password |
| **Chat** | Click user → Type message → Send |
| **Share Image** | Click 📷 icon → Select image → Send |
| **Profile** | Click 👤 icon → Change picture |
| **Settings** | Click ⚙️ → Toggle options |
| **Logout** | Click 🚪 icon → Logout |

---

## 📊 Project Stats

| Component | Count | Status |
|-----------|-------|--------|
| Pages | 5 | ✅ Complete |
| Components | 3 | ✅ Complete |
| Contexts | 2 | ✅ Complete |
| API Services | 1 | ✅ Complete |
| Models | 2 | ✅ Complete |
| Routes | 2 | ✅ Complete |
| Controllers | 2 | ✅ Complete |
| Features | 10+ | ✅ Complete |

---

## 🔌 Socket.IO Events

```javascript
// Client sends
socket.emit("user_online", userId);
socket.emit("send_message", messageObj);

// Server sends
socket.on("user_status", statusObj);
socket.on("new_message", messageObj);
socket.on("receive_message", messageObj);
```

---

## 🛣️ API Endpoints

### Auth
- `POST /api/auth/signup` → Register
- `POST /api/auth/login` → Login
- `POST /api/auth/logout` → Logout
- `GET /api/auth/check` → Check auth
- `PUT /api/auth/update` → Update profile

### Messages
- `GET /api/messages/users` → Get all users
- `GET /api/messages/:id` → Get chat history
- `POST /api/messages/send/:id` → Send message

---

## 🎨 Colors Used

| Component | Colors |
|-----------|--------|
| Background | Gray-900, Gray-800 |
| Primary | Blue-600, Blue-500 |
| Accent | Purple-600, Green-500 |
| Text | White, Gray-300, Gray-400 |

---

## 📦 Key Dependencies

### Frontend
- `react@19` - UI
- `socket.io-client@4.8` - Real-time
- `axios@1.6` - HTTP
- `tailwindcss@4` - Styling
- `lucide-react@0.408` - Icons
- `react-hot-toast@2.4` - Notifications

### Backend
- `express@5` - Web server
- `socket.io@4.8` - Real-time
- `mongoose@8` - MongoDB
- `jwt@9` - Auth
- `bcryptjs@3` - Password
- `cloudinary@2.8` - Images

---

## ❓ Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Can't connect to MongoDB | Check `mongod` running, verify `MONGO_URI` |
| Can't login | Check backend console, verify `JWT_SECRET` |
| Images don't upload | Verify Cloudinary credentials, check file size |
| Socket.IO fails | Ensure backend on 5000, frontend `.env` correct |
| Port 5000 in use | Kill process: `lsof -ti:5000 \| xargs kill -9` |

---

## 🎯 Features Overview

✅ **Authentication**
- Secure signup/login
- JWT tokens
- Password hashing

✅ **Messaging**
- Real-time delivery
- Message history
- Image sharing

✅ **User Management**
- Profile pictures
- Online/offline status
- User search

✅ **Settings**
- Theme toggle
- Notifications
- Sound preferences

✅ **UI/UX**
- Responsive design
- Dark theme
- Toast notifications
- Smooth animations

---

## 🧪 Testing Checklist

- [ ] Signup with profile picture
- [ ] Login with correct credentials
- [ ] See online users list
- [ ] Send text message
- [ ] Send image message
- [ ] Receive messages in real-time
- [ ] See online/offline status
- [ ] Change profile picture
- [ ] Update settings
- [ ] Logout and redirect

---

## 📚 File Locations

```
Key Files:

Frontend:
- Pages: src/pages/*.jsx
- Components: src/components/*.jsx
- Contexts: src/context/*.jsx
- Services: src/services/api.js
- Config: .env.local

Backend:
- Server: src/index.js
- Controllers: src/controllers/*.js
- Models: src/models/*.js
- Routes: src/routes/*.js
- Config: .env
```

---

## 💡 Pro Tips

1. **Dev Tools**: Open F12 for browser console
2. **Backend Logs**: Check terminal for API errors
3. **Clear Cache**: Ctrl+Shift+Del to clear browser cache
4. **Socket Check**: Open DevTools → Network → WS to see socket connection
5. **Local Storage**: Check settings saved in browser storage

---

## 🚀 Deployment (Future)

```bash
# Frontend (Vercel)
npm run build
# Deploy the dist/ folder

# Backend (Heroku/Railway)
git push heroku main
# Update VITE_API_URL to production backend
```

---

## 📞 Quick Help

- **Backend won't start**: Check ports, MongoDB running
- **Frontend won't start**: Check Node version, clear node_modules
- **Messages not sending**: Check Socket.IO connection, JWT token
- **Images not uploading**: Check Cloudinary credentials, file size
- **Can't login**: Check database connection, JWT_SECRET

---

**Ready to chat?** Run `npm run dev` in both directories! 🎉
