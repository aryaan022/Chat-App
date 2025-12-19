import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    text:{
        type:String,
    },
    image:{
        type:String,
    },
    sentiment:{
        type:String,
        enum:['positive', 'neutral', 'negative'],
        default:'neutral'
    },
    sentimentScore:{
        type:Number,
        default:0
    },
    translatedText:{
        type:Map,
        of:String,
        default:{}
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    readBy:[{
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        readAt:{
            type:Date,
            default:Date.now
        }
    }],
    reactions:[{
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        emoji:{
            type:String
        }
    }]
}, {timestamps:true});

// Index for efficient querying
messageSchema.index({ createdAt: 1 });
messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ text: 'text' });

const Message = mongoose.model('Message', messageSchema);
export default Message;
