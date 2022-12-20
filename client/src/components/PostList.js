import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { PostCard } from './PostCard'
import { socket } from '../lib/io'

async function fetchPosts () {
  const response = await axios.get('http://posts.com/posts')
  console.log('query:posts', response.data)
  return Object.values(response.data)
}

export function PostList () {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    socket.on('event', (newEvent) => {
      console.log('client: neveEvent', newEvent)
      if (newEvent.type === 'queryPostSrvc') {
        console.log('queryPostSrvc event detected. RePulling in comments')
        fetchPosts()
        .then(data => setPosts(data))
        .catch(err => {
          console.log('error captured:', err)
        })
      }
    })
    
    return () => {
      socket.disconnected()
    }
  }, [])

  useEffect(() => {
    fetchPosts()
    .then(data => setPosts(data))
    .catch(err => {
      console.log('error captured:', err)
    })
  }, [])

  const renderedPost = useMemo(
    () =>
      posts.map(post => (
        <PostCard key={post.id} post={post} />
      )),
    [posts]
  )
  console.log(' render post', posts)
  return (
    <div className='post-list'>
      <h1>POST LIST</h1>
      <div className='d-flex flex-row flex-wrap justify-content-between'>
        {renderedPost}
      </div>
    </div>
  )
}
