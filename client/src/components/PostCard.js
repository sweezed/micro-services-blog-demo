import React from 'react'
import { CommentCreate } from './CommentCreate'
import { CommentList } from './CommentList'

export function PostCard ({ post }) {
  return (
    <div
      className='card'
      style={{ width: '30%', marginBottom: '20px' }}
    >
      <div className='card-body'>
        <h2>{post.title}</h2>
        <CommentList comments={post.comments} />
        <CommentCreate id={post.id} />
      </div>
    </div>
  )
}
