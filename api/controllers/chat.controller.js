import prisma from "../lib/prisma.js"


export const getChats = async(req,res) =>{
    const tokenUserId = req.userId

    try{
        const chats = await prisma.chat.findMany({
            where:{
                userIDs:{
                    hasSome:[tokenUserId],
                }
            }
        })
        // Add userInfo ลงไปในChatด้วย
        for(const chat of chats){
            const receiverId = chat.userIDs.find(id =>id !== tokenUserId)

            const reciver = await prisma.user.findUnique({
                where:{
                    id:receiverId,
                },
                // เลือกแค่บาง row ของ user
                select:{
                    id:true,
                    username:true,
                    avatar:true,
                }
            })
            chat.reciver = reciver; 
        }
        res.status(200).json(chats)
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Failed to get chats!"})
    }
}

export const getChat = async(req,res) => {
    const tokenUserId = req.userId;

    try{
        const chat = await prisma.chat.findUnique({
            where:{
                id:req.params.id,
                userIDs:{
                    // just owner can fetch this chat
                    hasSome:[tokenUserId],
                },
            },
            include:{
                messages:{
                    orderBy:{
                        createdAt: "asc",
                    },
                },
            },
        });
        // update chat
        await prisma.chat.update({
            where:{
                id:req.params.id
            },
            data:{
                seenBy:{
                    push:[tokenUserId]
                }
            }
        })
        res.status(200).json(chat)
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Failed to get chats!"})
    }
}

export const addChat = async(req,res) =>{
    const tokenUserId = req.userId
    try{
        const newChat = await prisma.chat.create({
            data:{
                userIDs:[tokenUserId,req.body.receiverId]
            }
        })
        res.status(200).json(newChat);
    }catch(err){
        console.log(err)
        res.status(200).json({message:"Failed to get chats!"})
    }
}

export const readChat = async(req,res) =>{
    const tokenUserId = req.userId
    try{
        const chat = await prisma.chat.update({
            //conditon
            where:{
                id:req.params.id,
                userIDs:{
                    hasSome:[tokenUserId]
                }
            },
            // update data
            data:{
                seenBy:{
                    push:[tokenUserId]
                }
            }
        })
        res.status(200).json(chat);
    }catch(err){
        console.log(err)
        res.status(200).json({message:"Failed to get chats!"})
    }
}