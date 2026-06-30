import { Result } from './../../../generated/prisma/internal/prismaNamespace';
import { prisma } from "../../lib/prisma"
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface"
import { commentStatus } from '../../../generated/prisma/enums';

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
                    omit: {
                        password: true
                    }
                },
                comments: true

            }
        })

    return getAllPost

}

 const getPostById = async (postId : string) => {

    // await prisma.post.update({
    //     where : {
    //         id : postId,
    //     },
    //     data : {
    //         views : {
    //             increment : 1
    //         },
    //     }
    // })

    // throw new Error("Fake Error")

    // const post = await prisma.post.findUniqueOrThrow({
    //     where : {
    //         id : postId
    //     },

    //     include : {
    //         author : {
    //             omit : {
    //                 password : true
    //             }
    //         },

    //         comments : {
    //             where : {
    //                 status : CommentStatus.APPROVED
    //             },

    //             orderBy : {
    //                 createdAt : "desc"
    //             }
    //         },

    //         _count : {
    //             select : {
    //                 comments : true
    //             }
    //         }
    //     }
    // })

    // return post

    const transactionResult = await prisma.$transaction(
        async (tx) => {
            await tx.post.update({
                where: {
                    id: postId,
                },
                data: {
                    views: {
                        increment: 1
                    },
                }
            });
            // throw new Error("fake error")
            const post = await tx.post.findUniqueOrThrow({
                where: {
                    id: postId,
                    isPremium: false
                },

                include: {
                    author: {
                        omit: {
                            password: true
                        }
                    },

                    comments: {
                        where: {
                            status: commentStatus.APPROVED
                        },

                        orderBy: {
                            createdAt: "desc"
                        }
                    },

                    _count: {
                        select: {
                            comments: true
                        }
                    }
                }
            });
            return post
        }
    );

    return transactionResult

}


 





const updatePost = async (postId: string, payload: IUpdatePostPayload, authorId: string, isAdmin: boolean) => {

    const post = await prisma.post.findFirstOrThrow({
        where: {
            id: postId
        }
    })

    if (!isAdmin && post.authorId !== authorId) {
        throw new Error('you are not the owner of this post')
    }

    const result = await prisma.post.update({
        where: {
            id: postId
        },
        data: payload,
        include: {
            author: {
                omit: {
                    password: true
                }
            },
            comments: true
        }
    })

    return result
}

const deletePost = async (postId: string, authorId: string, isAdmin: boolean) => {
    const post = await prisma.post.findFirstOrThrow({
        where: {
            id: postId
        }
    })

    if (!isAdmin && post.authorId !== authorId) {
        throw new Error('you are not the owner of this post')
    }
    
     const result = await prisma.post.delete({
         where: {
            id: postId
        }
     })

     return result
       
}
    
const getPostsStats = async () => {

    }

    const getMyPosts = async (authorId: string) => {

        const result = await prisma.post.findMany({
            where: {
                authorId
            },
            orderBy: {
                createdAt: "desc"
            },
            include: {
                comments: true,
                author: {
                    omit: {
                        password: true
                    }

                },

                _count: {
                    select: {
                        comments: true
                    }
                }
            }
        })

        return result
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