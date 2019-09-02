import React from 'react';
import { Button, List } from 'antd';


const ClickableButton = ({ id, onClick, ...rest }) => {
  const handleClick = (e) => {
    onClick(id);
  }
  return <Button onClick={handleClick} {...rest}/>
};

export default ({ onPublish, onDelete, id, title, author, createdAt, updatedAt }) => (
  <List.Item
    actions={[
      onPublish && <ClickableButton id={id} onClick={onPublish} type="success">Publish</ClickableButton>,
      onDelete && <ClickableButton id={id} onClick={onDelete} type="danger">Delete</ClickableButton>,
    ]}
  >
    <List.Item.Meta title={title} description={`created by ${author.id}`} />
  </List.Item>
);
