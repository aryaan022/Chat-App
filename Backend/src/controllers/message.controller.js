import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from '../lib/cloudinary.js';
import { analyzeSentiment, getMessageSuggestions, translateMessage } from '../lib/ai.js';
import { searchMessages, getMessageStats } from '../lib/search.js';

export const getUsersForSidebar = async(req,res)=>{
    try{
        const LoggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id:{$ne:LoggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);
    }catch(error){
        console.log("Error in getUsersForSidebar:",error.message);
        return res.status(500).json({error:" Internal Server error"});
    }
};

export const getMessages = async(req,res)=>{
    try{
        const{id:userToChatId}=req.params;
        const myId=req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId},
            ],
            isDeleted: false
        })
        .populate('senderId', 'fullName profilePic')
        .populate('receiverId', 'fullName profilePic')
        .sort({ createdAt: 1 });

        res.status(200).json(messages);

    }catch(error){
        console.log("Error in getMessages:",error.message);
        return res.status(500).json({error:" Internal Server error"});
    }
};

export const sendMessage = async(req,res)=>{
    try{
        const{text,image}=req.body;
        const{id:receiverID}=req.params;
        const senderID=req.user._id;
        
        let imageUrl;

        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }

        // Analyze sentiment
        let sentimentData = { sentiment: 'neutral', score: 0 };
        if (text) {
            sentimentData = analyzeSentiment(text);
        }

        const newMessage = new Message({
            senderId:senderID,
            receiverId:receiverID,
            text,
            image:imageUrl,
            sentiment: sentimentData.sentiment,
            sentimentScore: sentimentData.score
        });
        await newMessage.save();
        
        // Populate sender info
        await newMessage.populate('senderId', 'fullName profilePic');

        console.log(`Message saved from ${senderID} to ${receiverID} - Sentiment: ${sentimentData.sentiment}`);

        res.status(201).json(newMessage);
    }
    catch(error){
        console.log("Error in sendMessage:",error.message);
        return res.status(500).json({error:" Internal Server error"});
    }
};

// Delete message
export const deleteMessage = async(req,res)=>{
    try{
        const {messageId} = req.params;
        const userId = req.user._id;

        const message = await Message.findById(messageId);
        
        if (!message) {
            return res.status(404).json({error: "Message not found"});
        }

        // Only sender can delete their message
        if (message.senderId.toString() !== userId.toString()) {
            return res.status(403).json({error: "Not authorized to delete this message"});
        }

        message.isDeleted = true;
        message.text = "[This message was deleted]";
        await message.save();

        res.status(200).json({success: true, message: "Message deleted"});
    }catch(error){
        console.log("Error in deleteMessage:",error.message);
        return res.status(500).json({error:" Internal Server error"});
    }
};

// Mark message as read
export const markAsRead = async(req,res)=>{
    try{
        const {messageId} = req.params;
        const userId = req.user._id;

        const message = await Message.findByIdAndUpdate(
            messageId,
            {
                $addToSet: {
                    readBy: {
                        userId,
                        readAt: new Date()
                    }
                }
            },
            {new: true}
        );

        res.status(200).json(message);
    }catch(error){
        console.log("Error in markAsRead:",error.message);
        return res.status(500).json({error:" Internal Server error"});
    }
};

// Add reaction to message
export const addReaction = async(req,res)=>{
    try{
        const {messageId} = req.params;
        const {emoji} = req.body;
        const userId = req.user._id;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({error: "Message not found"});
        }

        // Remove existing reaction from this user
        message.reactions = message.reactions.filter(r => r.userId.toString() !== userId.toString());
        
        // Add new reaction
        message.reactions.push({userId, emoji});
        await message.save();

        res.status(200).json(message);
    }catch(error){
        console.log("Error in addReaction:",error.message);
        return res.status(500).json({error:" Internal Server error"});
    }
};

// Get AI suggestions
export const getAISuggestions = async(req,res)=>{
    try{
        const {context} = req.query;
        
        if (!context) {
            return res.status(400).json({error: "Context required"});
        }

        const suggestions = await getMessageSuggestions(context);
        res.status(200).json({suggestions});
    }catch(error){
        console.log("Error in getAISuggestions:",error.message);
        return res.status(500).json({error:" Internal Server error"});
    }
};

// Translate message
export const translateMsg = async(req,res)=>{
    try{
        const {text, language} = req.body;
        
        if (!text || !language) {
            return res.status(400).json({error: "Text and language required"});
        }

        const translatedText = await translateMessage(text, language);
        res.status(200).json({translatedText});
    }catch(error){
        console.log("Error in translateMsg:",error.message);
        return res.status(500).json({error:" Internal Server error"});
    }
};

// Export search functions
export const smartSearch = searchMessages;
export const getStats = getMessageStats;