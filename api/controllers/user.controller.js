import prisma from "../lib/prisma.js"
import bcrypt from "bcrypt";
export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failde to get users!" })
    }
}
export const getUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await prisma.user.findUnique({
            where: { id: id }, //id == id
        });
        res.status(200).json(user);
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failde to get users!" })
    }
}
export const updateUser = async (req, res) => {
    // data จะส่งมาทาง Body
    const id = req.params.id;
    const tokenUserId = req.userId;
    // ถ้า Update Password updateตรงๆเลย sperate password จาก body
    const { password, avatar, ...input } = req.body;
    if (id !== tokenUserId) {
        res.status(403).json({ message: "Not Authorized!" });
    }
    let updatedPassword = null;
    try {
        //ถ้ามี passwordจะ true
        if (password) {
            updatedPassword = await bcrypt.hash(password, 10)
        }
        const updateUser = await prisma.user.update({
            where: { id: id },
            data: {
                ...input,
                ...(updatedPassword && { password: updatedPassword }),// ถ้า updatedPassword มีค่า จะ password = updatedPassword
                ...(avatar && { avatar: avatar }), // ถ้าส่ง avtar มาก็จะ update
            }
        });
        const {password:userPassword, ...rest} =  updateUser // ใช้ userPassword เพราะ passwordใช้ไปแล้ว
        console.log(updateUser);
        res.status(200).json(rest);
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failde to update users!" })
    }
}
export const deleteUser = async (req, res) => {
    // data จะส่งมาทาง Body
    const id = req.params.id;
    const tokenUserId = req.userId;
    // ถ้า Update Password updateตรงๆเลย sperate password จาก body
    if (id !== tokenUserId) {
        res.status(403).json({ message: "Not Authorized!" });
    }
    try {
        await prisma.user.delete({
            where:{id:id}, 
        })
        res.status(200).json({message: "User deleted"});
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failde to delete users!" })
    }
}
export const savePost = async (req,res) =>{
    //take postid form body
    const postId = req.body.postId
    const tokenId = req.userId // userId
    console.log(tokenId);
    console.log(postId)
    try{
        // check post is saved ?
        const savePost = await prisma.savePost.findUnique({
            where:{
                userId_postId:{
                    userId:tokenId,
                    postId:postId
                }
            }
        })
        console.log("Token is : ",savePost)
        if(savePost){
            await prisma.savePost.delete({
                where:{
                    id:savePost.id,
                }
            })
            res.status(200).json({message:"Post remove form saved list"})
        }else{
            await prisma.savePost.create({
                data:{
                    userId:tokenId,
                    postId:postId
                }
            })
            res.status(200).json({message:"Post saved"})
        }
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Falied to save poast!"})
    }
}

export const profilePosts = async(req,res) =>{
    const tokenUserId = req.userId
    console.log(tokenUserId)
    try{
        //ourpost
        const userPosts = await prisma.post.findMany({
            where:{ userId:tokenUserId}
        })
        const saved = await prisma.savePost.findMany({
            where:{userId:tokenUserId},
            // use only post
            include:{
                post:true,
            }
        })
        const savedPost = saved.map((item) => item.post)
        console.log(saved)
        console.log(savedPost)
        res.status(200).json({userPosts,savedPost})
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Failed to get profile post!"})
    }
}
export const getNotificationNumber = async(req,res) =>{
    const tokenUserId = req.userId
    try{
        const number =  await prisma.chat.count({
            where:{
                userIDs:{
                    hasSome:[tokenUserId],
                },
                NOT:{
                    seenBy:{
                        hasSome :[tokenUserId]
                    }
                }
            },
        });
        console.log(number)
        res.status(200).json(number);
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Failed to get profile post!"})
    }
}