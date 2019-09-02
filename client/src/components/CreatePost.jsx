import React from 'react';
import { Card, Button, Form, Input } from 'antd';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { POSTS_QUERY } from './Posts';
import { POST_WITH_AUTHOR_FRAGMENT } from './fragments';

const CREATE_DRAFT = gql`
  mutation AddTodo($title: String!) {
    createDraft(title: $title) {
      ...PostWithAuthor
    }
  }
  ${POST_WITH_AUTHOR_FRAGMENT}
`

const TodoForm = (props) => {
  const [createDraft] = useMutation(CREATE_DRAFT);
  const handleSubmit = (e) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      createDraft({
        variables: { title: values.title },
        refetchQueries: [{
          query: POSTS_QUERY,
          variables: { published: false }
        }],
      });
    });
  }
  return (
    <Card>
      <Form onSubmit={handleSubmit}>
        <h2>Create a new Post</h2>
        <Form.Item>
          {props.form.getFieldDecorator('title', {
            rules: [
              { required: true, message: 'This field is required' }
            ],
          })(
            <Input placeholder="title" />
          )}
        </Form.Item>
        <Button type="primary" htmlType="submit">Submit</Button>
      </Form>
    </Card>
  )
};

export default Form.create({ name: 'create_todo' })(TodoForm);
