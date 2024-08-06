import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken"
export const getPosts = async (req, res) => {
    const query = req.query;
    console.log(query);
    try {
        const posts = await prisma.post.findMany({
            where: {
                city: query.city || undefined,
                type: query.type || undefined,
                property: query.property || undefined,
                type: query.type || undefined,
                bathroom: parseInt(query.bathroom) || undefined,
                bedroom: parseInt(query.bedroom) || undefined,
                price: {
                    gte: parseInt(query.minPrice) || 0,
                    lte: parseInt(query.maxPrice) || 1000000000,
                }
            }
        })

        // setTimeout(() =>{
        res.status(200).json(posts)
        // },3000) 
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed to get Posts" })
    }
}
export const getPost = async (req, res) => {
    const id = req.params.id
    try {
        const post = await prisma.post.findUnique({
            where: { id: id }, // id แรกของ post id 2 ของ params
            include: {
                //struct in schema.prisma
                postDetail: true,
                user: {
                    select: {
                        username: true,
                        avatar: true,
                    }
                }
            }
        })
        let userId;
        // check already login ?
        console.log(req.cookies)
        console.log("error line 48")
        const token = req.cookies.token;
        console.log(token)

        if (!token) {
            userId = null
        } else {
            //jwt.verify(token,process.env.JWT_SECRET_KEY , async(err,payload) คือ return err ? payload
            jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
                if (err) {
                    userId = null
                } else {
                    userId = payload.id;
                }
            })
        }

        const saved = await prisma.savePost.findUnique({
            where: {
                userId_postId: {
                    postId: id,
                    userId: userId
                }
            }
        })
        res.status(200).json({...post,isSaved : saved ? true : false})
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed to get Posts by id" })
    }
}
export const addPost = async (req, res) => {
    const body = req.body;
    const userid = req.userId;
    try {
        const newPost = await prisma.post.create({
            data: {
                ...body.postData, // take everything in body
                userId: userid,
                postDetail: {
                    create: body.postDetail,
                },
            }
        })
        res.status(200).json(newPost)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed to Create post " })
    }
}
export const updatePost = async (req, res) => {
    try {
        res.status(200).json()
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed to update Posts" })
    }
}
export const deletePost = async (req, res) => {
    const postId = req.params.id
    const tokenUserId = req.userId // ได้มาจาก verifytoken
    try {
        const post = await prisma.post.findUnique({
            where: { id: postId }
        })
        if (post.userId !== tokenUserId) { // mean you not owner
            return res.status(403).json({ message: "Not Authorized!" })
        }
        await prisma.post.delete({
            where: { id: postId }
        })
        res.status(200).json({ message: `Post id ${postId} is deleted` })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed to delete Posts" })
    }
}