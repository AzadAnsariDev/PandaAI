import {Router} from 'express'
import { authUser } from '../middlewares/auth.middleware.js'
import { deleteChat, getChats, getMessages, sendMessage } from '../controllers/chat.controller.js'

const chatRouter = Router()

/*
 * @route POST /api/chat/message
    * @desc Send a message in a chat
    * @access Private
 */
chatRouter.post("/message",authUser, sendMessage)

chatRouter.get("/getChats", authUser, getChats)

chatRouter.get("/:chatId/message" ,authUser, getMessages)

chatRouter.delete("/delete/:chatId", authUser, deleteChat)


export default chatRouter