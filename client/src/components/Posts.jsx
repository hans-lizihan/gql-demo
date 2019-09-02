import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Card, List } from 'antd';
import Post from './Post';
import { POST_WITH_AUTHOR_FRAGMENT } from './fragments';

export const POSTS_QUERY = gql`
  query Posts($published: Boolean!) {
    me {
      posts(where: { published: $published }) {
        ...PostWithAuthor
      }
    }
  }
  ${POST_WITH_AUTHOR_FRAGMENT}
`;

const PUBLISH_DRAFT = gql`
  mutation Publish($id: ID!) {
    publish(id: $id) {
      ...PostWithAuthor
    }
  }
  ${POST_WITH_AUTHOR_FRAGMENT}
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(where: { id: $id }) {
      ...PostWithAuthor
    }
  }
  ${POST_WITH_AUTHOR_FRAGMENT}
`;

export default ({ draft }) => {
  const { loading, error, data } = useQuery(POSTS_QUERY, { variables: { published: !draft }});
  const [publish] = useMutation(PUBLISH_DRAFT);
  const [deletePost] = useMutation(DELETE_POST);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const itemProps = {
    onDelete: (id) => {
      deletePost({
        variables: { id },
        refetchQueries: [
          { query: POSTS_QUERY, variables: { published: !draft }},
          { query: POSTS_QUERY, variables: { published: draft }}
        ],
      })
    }
  };
  if (draft) {
    itemProps.onPublish = (id) => {
      publish({
        variables: { id },
        refetchQueries: [
          { query: POSTS_QUERY, variables: { published: !draft }},
          { query: POSTS_QUERY, variables: { published: draft }}
        ],
      })
    }
  }

  return (
    <Card>
      <h2>{ draft ? 'Drafts' : 'Posts'}</h2>
      <List
        dataSource={data.me.posts}
        renderItem={item => <Post {...item} {...itemProps} />}
      />
    </Card>
  )
}
