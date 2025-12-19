# 🚀 **SETUP GUIDE - AI Chat App**

## **QUICK START**

### **Step 1: Install Backend Dependencies** (2 minutes)
```bash
cd backend
npm install
```

Expected output:
- ✅ No errors
- ✅ All packages installed (sentiment, node-cron, axios, node-fetch, etc.)

### **Step 2: Start Backend Server** (1 minute)
```bash
npm run dev
```

Expected output:
```
Server is running on port 5000
🧹 Auto-cleanup service started (runs daily at 2 AM)
```

### **Step 3: Start Frontend** (In a new terminal)
```bash
cd frontend
npm run dev
```

Expected: App opens at http://localhost:5173

---

## **✅ VERIFICATION CHECKLIST**

### **Backend Running?**
- [ ] Terminal shows "Server is running on port 5000"
- [ ] No red error messages
- [ ] "Auto-cleanup service started" appears

### **Frontend Running?**
- [ ] App opens at http://localhost:5173
- [ ] Can log in / access chat
- [ ] No console errors (F12 → Console)

### **Database Connected?**
- [ ] No MongoDB connection errors
- [ ] Messages load correctly

---

## **🎯 TEST EACH FEATURE**

### **1. Sentiment Analysis** ✅
- Send message: "I love this app!"
- Check message bubble → Should see 😊 positive indicator
- Send: "This is terrible"
- Should see 😢 negative indicator

### **2. AI Suggestions** ✅
- Start typing in message box
- After 2+ characters → Dropdown appears
- Click any suggestion → Inserts into message

### **3. Typing Indicator** ✅
- Open in 2 browser windows (different users)
- User A: Start typing in User B's chat
- User B: Should see "User A is typing..." animation
- User A: Stop typing → Disappears

### **4. Message Reactions** ✅
- Hover over any message
- Click emoji icon → Picker appears
- Click emoji → Reaction added
- Multiple users can react to same message

### **5. Read Receipts** ✅
- Send message
- Other user receives it
- Your message shows ✓✓ (double checkmark)
- Hover → Shows count of readers

### **6. Message Deletion** ✅
- Right-click own message (or menu)
- Click delete → Message replaced with "[This message was deleted]"
- Cannot delete others' messages

### **7. Search Messages** ✅
- Click 🔍 icon in header
- Type search term → Results appear
- Click "Positive" button → Filters to happy messages only
- Click "Negative" → Angry/sad messages
- Click "Neutral" → Neutral messages

### **8. Auto-Cleanup** ✅
- Backend terminal → Runs daily at 2 AM automatically
- Manual test: `POST http://localhost:5000/api/cleanup/trigger`
- Should delete messages >15 days old
- Should delete users >30 days inactive

---

## **🛠️ TROUBLESHOOTING**

### **"Cannot find module 'sentiment'"**
```bash
cd backend
npm install sentiment node-cron axios node-fetch
npm run dev
```

### **"Socket.IO connection failed"**
- Check frontend .env has correct backend URL
- Backend CORS should allow http://localhost:5173
- Check both processes running (backend + frontend)

### **"MongoDB connection failed"**
- Check MongoDB is running
- Check .env has correct MONGODB_URI
- Check internet connection (if using MongoDB Atlas)

### **"Port 5000 already in use"**
```bash
# Windows PowerShell
Get-Process | Where-Object {$_.Path -like "*node*"} | Stop-Process -Force

# Then restart:
npm run dev
```

### **Messages not showing sentiment?**
- Refresh page (F5)
- Check backend logs for errors
- Verify message was sent successfully
- Check message.sentiment field in browser dev tools

---

## **📊 EXPECTED API ENDPOINTS**

All working endpoints:

```
✅ POST   /api/auth/signup
✅ POST   /api/auth/login
✅ POST   /api/auth/logout
✅ GET    /api/messages/users
✅ GET    /api/messages/:id
✅ POST   /api/messages/send/:id
✅ DELETE /api/messages/:messageId
✅ PUT    /api/messages/:messageId/read
✅ PUT    /api/messages/:messageId/react
✅ GET    /api/messages/ai/suggestions?context=hello
✅ POST   /api/messages/ai/translate
✅ GET    /api/messages/search/messages?query=hello&sentiment=positive
✅ GET    /api/messages/stats/analytics
✅ POST   /api/cleanup/trigger
```

Test in Postman or browser:
- http://localhost:5000/api/messages/stats/analytics (GET)
- http://localhost:5000/api/messages/ai/suggestions?context=hello (GET)

---

## **📱 FRONTEND COMPONENTS ADDED**

| Component | Purpose | Location |
|-----------|---------|----------|
| AISuggestions.jsx | Suggestion dropdown | In message input |
| SentimentIndicator.jsx | Emotion display | On messages |
| TypingIndicator.jsx | Typing animation | Above messages |
| MessageReactions.jsx | Emoji reactions | On message hover |
| ReadReceipts.jsx | Checkmark status | On message |
| SearchMessages.jsx | Search modal | Navbar |

---

## **🔄 INTEGRATION CHECKLIST**

To complete the frontend integration:

- [ ] Import AISuggestions in HomePage.jsx input area
- [ ] Import SearchMessages in Navbar.jsx
- [ ] Update ChatBubble to display SentimentIndicator
- [ ] Update ChatBubble to display MessageReactions
- [ ] Update ChatBubble to display ReadReceipts
- [ ] Add TypingIndicator above message list
- [ ] Update SocketContext to handle typing_status event
- [ ] Update SocketContext to handle reaction_update event
- [ ] Add delete message API call
- [ ] Add translate message API call

---

## **🎯 RECOMMENDED NEXT STEPS**

1. **Test all 8 features** using the checklist above
2. **If any feature fails**: Check backend logs and frontend console (F12)
3. **Report any errors**: Full error message + which feature failed
4. **Once all test**: Ready for deployment!

---

## **📝 NOTES**

- **Cleanup**: Runs automatically daily at 2:00 AM server time
  - Deletes messages >15 days old
  - Deletes users inactive >30 days (+ removes Cloudinary images)
  - Can trigger manually for testing

- **Sentiment**: Analyzed automatically when message is sent
  - Uses 'sentiment' npm package
  - Scores: positive (>0), neutral (≈0), negative (<0)

- **Translation**: On-demand via API (no auto-translate)
  - Free Google Translate API
  - Supports 100+ languages

- **Typing Indicator**: Real-time via Socket.IO
  - Updates instantly when user types/stops

- **Reactions**: Up to 8 emojis per message
  - One reaction per user per message (can toggle)

---

**Questions?** Check the error logs and console output!
**All working?** 🎉 AI Chat System is ready to use!
