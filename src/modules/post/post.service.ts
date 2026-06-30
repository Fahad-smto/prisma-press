import { prisma } from "../../lib/prisma"
import { ICreatePostPayload } from "./post.interface"

const createPost = async (payload: ICreatePostPayload, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...payload,
            authorId: userId,
        },
    })

    return result
}



const getAllPosts = async () => {


    const getAllPost = await prisma.post.findMany(
        {
            include: {
                author: {
                    omit:{
                        password:true
                    }
                },
                comments: true
                        
             }
        })

    return getAllPost

}

const getPostById = async (postId: string) => {

    const post = await prisma.post.findFirstOrThrow({
        where:{
            id:postId
        }
    })

const updatedPost =await prisma.post.update({
    where :{
        id:postId ,
    },
    data:{
        views:{
            increment:1
        },
    },
     include:{
            author:{
                omit:{
                    password:true
                }
            },
            comments:true
        }

})

return updatedPost

}

const updatePost = async (postId: string, authorId: string, isAdmin: boolean) => {

}

const deletePost = async (postId: string, authorId: string, isAdmin: boolean) => {


}

const getPostsStats = async () => {

}

const getMyPosts = async (authorId: string) => {


}

export const postService = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getPostsStats,
    getMyPosts
}