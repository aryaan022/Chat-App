# ChatApp Hosting Guide

This guide explains how to host your full-stack ChatApp project with backend and frontend separately.

---

## **Quick Start (Recommended for Beginners)**

### **Backend: Deploy on Render**
1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repo (push your project there first)
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node src/index.js`
   - **Environment Variables**: Add from `.env.example`
5. Deploy!

### **Frontend: Deploy on Vercel**
1. Go to [vercel.com](https://vercel.com) and sign up
2. Import your GitHub repo
3. Configure:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable:
   - `VITE_API_URL=https://your-backend-url.onrender.com`
5. Deploy!

---

## **Step-by-Step Setup**

### **Step 1: Prepare Backend (.env file)**
Create `.env` in backend folder:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
JWT_SECRET=your_super_secret_jwt_key_change_this
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### **Step 2: Prepare Frontend**
Update `frontend/src/services/api.js` to use environment variable:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});
```

### **Step 3: Update Socket.IO Connection**
Update `frontend/src/context/SocketContext.jsx`:
```javascript
const socketURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const socket = io(socketURL, {
  reconnection: true,
  reconnectionDelay: 1000,
});
```

### **Step 4: Add build script to backend**
Update `backend/package.json`:
```json
"scripts": {
  "dev": "nodemon src/index.js",
  "start": "node src/index.js"
}
```

---

## **Hosting Providers Comparison**

| Provider | Backend | Frontend | Cost | Ease |
|----------|---------|----------|------|------|
| **Render** | ✅ | ✅ | Free tier | ⭐⭐⭐ |
| **Railway** | ✅ | ✅ | $5/mo | ⭐⭐⭐ |
| **Vercel** | Limited | ✅ | Free | ⭐⭐⭐⭐ |
| **Netlify** | Limited | ✅ | Free | ⭐⭐⭐⭐ |
| **Heroku** | ✅ | Limited | Paid | ⭐⭐ |
| **AWS** | ✅ | ✅ | Free tier | ⭐ |

---

## **Database: MongoDB Atlas (Cloud)**

1. Go to [mongodb.com/cloud](https://mongodb.com/cloud)
2. Sign up and create a cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
4. Add to `.env` as `MONGODB_URI`

---

## **Environment Variables for Each Platform**

### **Backend (Render/Railway/Heroku)**
```
MONGODB_URI=your_mongodb_atlas_uri
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
JWT_SECRET=secret_key
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

### **Frontend (Vercel/Netlify)**
```
VITE_API_URL=https://your-backend-url.com
```

---

## **Important: Before Deploying**

1. ✅ Push code to GitHub
2. ✅ Create `.env` files locally (don't commit them)
3. ✅ Update CORS origins in backend
4. ✅ Add environment variables to hosting dashboard
5. ✅ Update Socket.IO URL in frontend
6. ✅ Test locally first: `npm run dev` (backend) + `npm run dev` (frontend)

---

## **Debugging Deployment Issues**

### **CORS Error**
- Make sure `FRONTEND_URL` env var matches your frontend domain
- Check backend logs

### **Socket.IO Connection Failed**
- Verify `VITE_API_URL` in frontend env vars
- Ensure backend is running and accessible

### **MongoDB Connection Failed**
- Check `MONGODB_URI` string in `.env`
- Verify IP whitelist in MongoDB Atlas

---

## **Production Checklist**

- [ ] Database: MongoDB Atlas configured
- [ ] Backend: Deployed and running
- [ ] Frontend: Deployed and running
- [ ] Environment variables set correctly
- [ ] CORS configured
- [ ] Socket.IO working (test real-time features)
- [ ] File uploads working (Cloudinary)
- [ ] Authentication working (JWT)

---

## **Local Development (Before Hosting)**

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Visit: http://localhost:5173
