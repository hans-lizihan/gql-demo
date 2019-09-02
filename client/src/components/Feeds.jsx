import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { Card, List } from 'antd';
import Post from './Post';
import { POST_WITH_AUTHOR_FRAGMENT } from './fragments';

const FEEDS_QUERY = gql`
  query {
    feed {
      ...PostWithAuthor
    }
  }
  ${POST_WITH_AUTHOR_FRAGMENT}
`;
export default () => {
  const { loading, error, data } = useQuery(FEEDS_QUERY);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <Card>
      <h2>Feeds</h2>
      <List
        dataSource={data.feed}
        renderItem={item =>
          <Post
            {...item}
          />
        }
      />
    </Card>
  )
}
