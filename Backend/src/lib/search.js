import Message from '../models/message.model.js';

// Smart Search with filters
export const searchMessages = async (req, res) => {
    try {
        const { query, userId, startDate, endDate, sentiment } = req.query;
        const loggedInUserId = req.user._id;
        
        const filters = {
            $and: [
                {
                    $or: [
                        { senderId: loggedInUserId },
                        { receiverId: loggedInUserId }
                    ]
                },
                { isDeleted: false }
            ]
        };
        
        // Text search
        if (query && query.trim()) {
            filters.$and.push({
                $or: [
                    { text: { $regex: query, $options: 'i' } },
                    { translatedText: { $regex: query, $options: 'i' } }
                ]
            });
        }
        
        // Filter by specific user
        if (userId) {
            filters.$and.push({
                $or: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            });
        }
        
        // Filter by date range
        if (startDate || endDate) {
            const dateFilter = {};
            if (startDate) dateFilter.$gte = new Date(startDate);
            if (endDate) dateFilter.$lte = new Date(endDate);
            filters.$and.push({ createdAt: dateFilter });
        }
        
        // Filter by sentiment
        if (sentiment && ['positive', 'neutral', 'negative'].includes(sentiment)) {
            filters.$and.push({ sentiment });
        }
        
        const messages = await Message.find(filters)
            .populate('senderId', 'fullName profilePic')
            .populate('receiverId', 'fullName profilePic')
            .sort({ createdAt: -1 })
            .limit(50);
        
        res.status(200).json({
            count: messages.length,
            messages
        });
    } catch (error) {
        console.log('Search error:', error.message);
        res.status(500).json({ error: 'Search failed' });
    }
};

// Get message statistics
export const getMessageStats = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        
        const stats = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: loggedInUserId },
                        { receiverId: loggedInUserId }
                    ],
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: '$sentiment',
                    count: { $sum: 1 },
                    avgScore: { $avg: '$sentimentScore' }
                }
            }
        ]);
        
        // Count by date
        const messagesByDate = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: loggedInUserId },
                        { receiverId: loggedInUserId }
                    ],
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: -1 } },
            { $limit: 30 }
        ]);
        
        res.status(200).json({
            sentimentStats: stats,
            messagesByDate
        });
    } catch (error) {
        console.log('Stats error:', error.message);
        res.status(500).json({ error: 'Stats retrieval failed' });
    }
};

export default {
    searchMessages,
    getMessageStats
};
