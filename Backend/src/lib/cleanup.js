import cron from 'node-cron';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';
import cloudinary from './cloudinary.js';

// Run cleanup every day at 2 AM
export const startCleanupService = () => {
    cron.schedule('0 2 * * *', async () => {
        console.log('🧹 Starting cleanup service...');
        try {
            await cleanupOldMessages();
            await deleteInactiveUsers();
            console.log('✅ Cleanup completed successfully');
        } catch (error) {
            console.error('❌ Cleanup service error:', error.message);
        }
    });
};

// Delete messages older than 15 days
export const cleanupOldMessages = async () => {
    try {
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
        
        const result = await Message.deleteMany({
            createdAt: { $lt: fifteenDaysAgo }
        });
        
        console.log(`🗑️  Deleted ${result.deletedCount} messages older than 15 days`);
        return result.deletedCount;
    } catch (error) {
        console.error('Error cleaning up messages:', error.message);
        throw error;
    }
};

// Delete inactive users (30+ days) and their profile pictures
export const deleteInactiveUsers = async () => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const inactiveUsers = await User.find({
            lastActiveAt: { $lt: thirtyDaysAgo }
        });
        
        for (const user of inactiveUsers) {
            // Delete profile picture from Cloudinary
            if (user.profilePic) {
                try {
                    // Extract public_id from Cloudinary URL
                    const urlParts = user.profilePic.split('/');
                    const publicId = urlParts[urlParts.length - 1].split('.')[0];
                    
                    if (publicId) {
                        await cloudinary.uploader.destroy(`ChatApp/${publicId}`);
                        console.log(`🖼️  Deleted profile picture for user: ${user.fullName}`);
                    }
                } catch (error) {
                    console.log(`Warning: Could not delete profile pic for ${user.fullName}: ${error.message}`);
                }
            }
            
            // Delete all messages from this user
            await Message.deleteMany({
                $or: [
                    { senderId: user._id },
                    { receiverId: user._id }
                ]
            });
        }
        
        // Delete inactive users
        const deleteResult = await User.deleteMany({
            lastActiveAt: { $lt: thirtyDaysAgo }
        });
        
        console.log(`👤 Deleted ${deleteResult.deletedCount} inactive users`);
        return deleteResult.deletedCount;
    } catch (error) {
        console.error('Error deleting inactive users:', error.message);
        throw error;
    }
};

// Manual cleanup trigger (for testing)
export const triggerCleanup = async (req, res) => {
    try {
        const messageCount = await cleanupOldMessages();
        const userCount = await deleteInactiveUsers();
        
        res.status(200).json({
            success: true,
            message: 'Cleanup completed',
            deletedMessages: messageCount,
            deletedUsers: userCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Cleanup failed',
            error: error.message
        });
    }
};

export default {
    startCleanupService,
    cleanupOldMessages,
    deleteInactiveUsers,
    triggerCleanup
};
