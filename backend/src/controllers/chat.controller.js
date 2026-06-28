import { generateChatTitle, generateResponse } from "../services/ai.service.js"
import chatModel from '../models/chat.model.js'
import messageModel from "../models/message.model.js"
export async function sendMessage(req, res){
    const { message, chatId } = req.body

    let chatTitle, chat = null

    if(!chatId){
        chatTitle = await generateChatTitle(message)
        chat = await chatModel.create({
        user : req.user.id,
        title : chatTitle 
    })
    }

    const userMessage = await messageModel.create({
        chat : chatId || chat._id,
        content : message,
        role : "user"
    })

    const allMessages = await messageModel.find({
        chat: chatId || chat._id
    })

    const aiResult = await generateResponse(allMessages) 

    const aiMessage = await messageModel.create({
        chat : chatId || chat._id,
        content : aiResult,
        role : "ai"
    })

    res.json({
        chat,
        aiMessage
    })

}

export async function getChats(req, res){
    const user = req.user

    if(!user){
        return res.status(401).json({
            message : "Unauthorized Access",
            success : false,
            err: "user not found"
        })
    }

    const chats = await chatModel.find({
        user : user.id
    })

    res.status(200).json({
        message : "All chats fetched successfully",
        chats
    })
}

export async function getMessages(req, res){
    const {chatId} = req.params

    const chat = await chatModel.findOne({
        _id : chatId,
        user : req.user.id
    })

    if(!chat){
        return res.status(404).json({
            message : "Chat not Found",
            success : false,
            err: "user or Chat not found"
        })
    }

    const messages = await messageModel.find({chat : chatId})

    res.status(200).json({
        message : "All message fetched successfully",
        messages
    })
}

export async function deleteChat(req, res){
    const {chatId} = req.params

    const chat = await chatModel.findOneAndDelete({
        _id : chatId,
        user : req.user.id
    })

    if(!chat){
        return res.status(404).json({
            message : "chat not found",
            success: false,
            err: "user or chat not found"
        })
    }


    await messageModel.deleteMany({
        chat : chatId
    })

    res.status(200).json({
        message : "Chat deleted successfully"
    })

}