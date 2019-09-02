import { gql } from 'apollo-boost';

export const POST_WITH_AUTHOR_FRAGMENT = gql`
  fragment PostWithAuthor on Post {
    id
    title
    published
    author {
      id
      uuid
    }
  }
`;
