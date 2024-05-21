const Blog = require("../models/blogModel");
const validateMongoId = require("../utils/validateMongoId");
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const createBlog = asyncHandler(async(req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog)
    } catch (error) {
        throw new Error(error)
    }
})

const updateBlog = asyncHandler(async (req, res ) => {
    const { id } = req.params
    validateMongoId(id)
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true,
        });
    res.json(updateBlog)
    } catch (error) {
        throw new Error(error)
    }
})

const getBlog = asyncHandler(async (req, res ) => {
    const { id } = req.params;
    validateMongoId(id)
    try {
        const getBlog = await Blog.findById(id).populate('likes').populate('dislikes');
        await Blog.findByIdAndUpdate(id, {
          $inc: { numView: 1},  
        }, {
            new: true
        })
    res.json(getBlog)
    } catch (error) {
        throw new Error(error)
    }
})

const getAllBlog = asyncHandler(async (req, res ) => {
    try {
        const getBlogs = await Blog.find();
        res.json(getBlogs)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteBlog = asyncHandler(async (req, res ) => {
    const { id } = req.params
    validateMongoId(id)
    try {
        const deleteBlog = await Blog.findByIdAndDelete(id);
        await Blog.findByIdAndUpdate(id)
    res.json(deleteBlog)
    } catch (error) {
        throw new Error(error)
    }
})

const likeBlog = asyncHandler( async(req, res) => {
    const {blogId} = req.body;
    validateMongoId(blogId);

    //find the blog
    const blog = await Blog.findById(blogId);
    //find the login user
    const loginUserId = req?.user?._id;
    //check if it is liked
    const isLiked = blog.isLiked;
    //cehck if it is disliked
    const alrDisliked = blog?.dislikes?.find((userId) => userId?.toString()=== loginUserId?.toString()
);
    if(alrDisliked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
        },{
            new: true,
        });
        res.json(blog);
    }
    if(isLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false
        },{
            new: true,
        });
        res.json(blog);
    }else{
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: { likes: loginUserId },
            isLiked: true
        },{
            new: true,
        });
        res.json(blog);
    }
});

const dislikeBlog = asyncHandler( async(req, res) => {
    const {blogId} = req.body;
    validateMongoId(blogId);

    //find the blog
    const blog = await Blog.findById(blogId);
    //find the login user
    const loginUserId = req?.user?._id;
    //check if it is liked
    const isDisliked = blog.isDisliked;
    //cehck if it is disliked
    const alrliked = blog?.likes?.find((userId) => userId?.toString()=== loginUserId?.toString()
);
    if(alrliked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false,
        },{
            new: true,
        });
        res.json(blog);
    }
    if(isDisliked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false
        },{
            new: true,
        });
        res.json(blog);
    }else{
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: { dislikes: loginUserId },
            isDisliked: true
        },{
            new: true,
        });
        res.json(blog);
    }
});
module.exports = { createBlog, updateBlog, getBlog, getAllBlog, deleteBlog, likeBlog, dislikeBlog }