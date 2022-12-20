import React, { useRef } from 'react'
import axios from 'axios'

export function CommentCreate({ id }) {
  const commentInput = useRef()

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    const comment = commentInput.current.value
    await axios.post(`http://posts.com/post/${id}/comments`, {
      content: comment
    })
    commentInput.current.value = ''
  }

  return (
    <div className='comment-create'>
      <form onSubmit={onSubmitHandler}>
        <div className='form-group'>
          <em><label htmlFor='commentInput'>New Comment</label></em>
          <input ref={commentInput} id='commentInput' type='text' className='form-control' />
        </div>
        <button className='btn btn-primary'>Submit</button>
       </form>
    </div>
  )
}

