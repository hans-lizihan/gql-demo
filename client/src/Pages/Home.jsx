import React from 'react';
import CreatePost from '../components/CreatePost';
import Feeds from '../components/Feeds';
import Posts from '../components/Posts';

export default () => {
  return (
    <div>
      <div style={{padding: '32px 0'}}>
        <CreatePost />
      </div>
      <div style={{padding: '32px 0'}}>
        <Feeds />
      </div>
      <div style={{padding: '32px 0'}}>
        <Posts draft />
      </div>
      <div style={{padding: '32px 0'}}>
        <Posts draft={false} />
      </div>
    </div>
  )
}
