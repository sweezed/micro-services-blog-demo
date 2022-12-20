import React from 'react';


export function CommentList ({ comments }) {
  return (
    <div className="comment-list">
      <div className="comment-list-header">
        <h4>Comments</h4>
        <ul className='comments'>
          {comments.map(comment => {
            if (comment.status === 'approved') {
              return <li key={comment.id}>{comment.content}</li>
            }
              return <li key={comment.id}>{comment.status}</li>
          })}
        </ul>
      </div>
      <div className="comment-list-body">
      </div>
    </div>
  )
}