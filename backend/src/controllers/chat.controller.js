import { generateChatTitle, generateResponse } from "../services/ai.service.js"
import chatModel from '../models/chat.model.js'
import messageModel from "../models/message.model.js"
import { streamResponse } from "../services/ai.service.js"


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

// chat.controller.js
export async function sendMessageStream(req, res) {
  const { message, chatId } = req.body;

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");
  res.setHeader("Cache-Control", "no-cache");

  let chatDoc = chatId ? await chatModel.findById(chatId) : null;

  if (!chatDoc) {
    const chatTitle = await generateChatTitle(message);
    chatDoc = await chatModel.create({ user: req.user.id, title: chatTitle });
    res.write(JSON.stringify({ type: "meta", chat: chatDoc }) + "\n");
  }

  const fullAnswer = await streamResponse(message, (token) => {
    res.write(JSON.stringify({ type: "token", content: token }) + "\n");
  });

  await messageModel.create({ chat: chatDoc._id, role: "user", content: message });
  await messageModel.create({ chat: chatDoc._id, role: "assistant", content: fullAnswer });

  res.write(JSON.stringify({ type: "done" }) + "\n");
  res.end();
}