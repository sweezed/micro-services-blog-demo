import React, { useRef } from 'react'
import axios from 'axios'

export function PostCreate () {
  const titleInput = useRef()

  const onSubmitHandler = async e => {
    e.preventDefault()
    const title = titleInput.current.value
    const url = 'http://posts.com/post/create'
    await axios.post(url, {title: title})
    titleInput.current.value = ''
  }

  return (
    <div>
      <h1>Create Post</h1>
      <form onSubmit={onSubmitHandler}>
        <div className='form-group'>
          <label htmlFor='title'>Title</label>
          <input
            ref={titleInput}
            type='text'
            className='form-control'
            id='title'
            name='title'
          />
        </div>
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  )
}
