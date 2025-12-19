import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
    getUsersForSidebar, 
    getMessages, 
    sendMessage,
    deleteMessage,
    markAsRead,
    addReaction,
    getAISuggestions,
    translateMsg,
    smartSearch,
    getStats
} from "../controllers/message.controller.js";

const router = express.Router();

// AI features (MUST BE BEFORE /:id routes)
router.get("/ai/suggestions", protectRoute, getAISuggestions);
router.post("/ai/translate", protectRoute, translateMsg);

// Search & Analytics (MUST BE BEFORE /:id routes)
router.get("/search/messages", protectRoute, smartSearch);
router.get("/stats/analytics", protectRoute, getStats);

// Basic routes
router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

// Message features
router.delete("/:messageId", protectRoute, deleteMessage);
router.put("/:messageId/read", protectRoute, markAsRead);
router.put("/:messageId/react", protectRoute, addReaction);

export default router;