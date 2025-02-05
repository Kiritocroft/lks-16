"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function DashboardPage() {
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: "", description: "", media: null });
    const [profilePic, setProfilePic] = useState("https://via.placeholder.com/100"); 
    const [isEditing, setIsEditing] = useState(false); 
    const [fileName, setFileName] = useState(""); 
    const [user, setUser] = useState(null); 

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch("/api/users");
            const data = await res.json();
            setUsers(data);
        };
        fetchUsers();
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser)); 
        }
    }, []);

    const handlePostSubmit = () => {
        setPosts([
            ...posts,
            {
                title: newPost.title,
                description: newPost.description,
                media: newPost.media,
            },
        ]);
        setNewPost({ title: "", description: "", media: null });
    };

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        setNewPost({ ...newPost, media: URL.createObjectURL(file) });
        setFileName(file.name);
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePic(reader.result); 
            setFileName(file.name); 
            setIsEditing(false); 
        };
        if (file) {
            reader.readAsDataURL(file); 
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false); 
        setFileName(""); 
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Dashboard</h1>

                {user ? (
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="relative group w-24 h-24">

                            <Image
                                src={profilePic} 
                                alt={`${user.name} profile`}
                                layout="fill" 
                                objectFit="cover" 
                                className="rounded-full border-4 border-gray-300 cursor-pointer transition-all duration-300 ease-in-out"
                            />
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
                            <p className="text-gray-600">{user.email}</p>

                            {isEditing ? (
                                <div className="mt-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="mb-2 p-2 bg-gray-100 rounded-md border border-gray-300"
                                        onChange={handleProfilePicChange}
                                    />
                                    <p className="text-sm text-gray-500 mt-1">{fileName ? fileName : "No file chosen"}</p>
                                    <div className="mt-2">
                                        <button
                                            onClick={handleCancelEdit}
                                            className="text-sm text-red-500 hover:underline mr-4"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-sm text-blue-500 hover:underline mt-2"
                                >
                                    Edit Profile Picture
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">Loading user data...</p> 
                )}


                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Title"
                        className="w-full p-4 mb-4 border rounded-lg text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    />
                    <textarea
                        placeholder="Description"
                        className="w-full p-4 mb-4 border rounded-lg text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                        rows="4"
                        value={newPost.description}
                        onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                    ></textarea>

                    <label htmlFor="media-upload" className="text-lg font-medium text-blue-500 cursor-pointer">
                        Upload Photo/Video
                    </label>
                    <input
                        id="media-upload"
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={handleMediaChange}
                    />
                    <div className="mb-4 mt-2">
                        {newPost.media && (
                            <img
                                src={newPost.media}
                                alt="Uploaded media"
                                className="w-full mx-auto rounded-lg object-contain"
                                style={{
                                    height: 'auto',
                                    maxWidth: '100%',
                                    maxHeight: '300px',
                                    objectFit: 'contain', 
                                }}
                            />
                        )}
                    </div>

                    <button
                        onClick={handlePostSubmit}
                        className="w-full p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Post
                    </button>
                </div>

                <div>
                    {posts.length > 0 ? (
                        posts.map((post, index) => (
                            <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
                                <h3 className="text-xl font-semibold text-gray-700">{post.title}</h3>
                                <p className="text-gray-600">{post.description}</p>
                                {post.media && (
                                    <div className="mt-4">
                                        {post.media.includes("video") ? (
                                            <video controls className="w-full max-w-lg mx-auto rounded-lg">
                                                <source src={post.media} type="video/mp4" />
                                            </video>
                                        ) : (
                                            <img
                                                src={post.media}
                                                alt="Uploaded media"
                                                className="w-full mx-auto rounded-lg object-contain"
                                                style={{
                                                    height: 'auto',
                                                    maxWidth: '100%', 
                                                    maxHeight: '400px', 
                                                    objectFit: 'contain',
                                                }}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No posts yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
