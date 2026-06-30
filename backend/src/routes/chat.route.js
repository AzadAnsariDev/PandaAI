import {Router} from 'express'
import { authUser } from '../middlewares/auth.middleware.js'
import { deleteChat, getChats, getMessages ,sendMessageStream} from '../controllers/chat.controller.js'
import multer from 'multer'

const upload = multer({storage : multer.memoryStorage()})

const chatRouter = Router()

/*
 * @route POST /api/chat/message
    * @desc Send a message in a chat
    * @access Private
 */

chatRouter.get("/getChats", authUser, getChats)

chatRouter.get("/:chatId/message" ,authUser, getMessages)

chatRouter.delete("/delete/:chatId", authUser, deleteChat)

// chat.routes.js
chatRouter.post("/message/stream",authUser, upload.single("image"), sendMessageStream);


export default chatRouter