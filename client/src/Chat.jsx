import React, { useState } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useSubscription,
  useMutation,
  gql,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { Container, Row, Col, FormInput, Button } from 'shards-react';

const link = new WebSocketLink({
  uri: 'ws://localhost:4000',
  options: {
    reconnect: true,
  },
});

const client = new ApolloClient({
  link,
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
});

const GET_MESSAGES = gql`
  subscription {
    messages {
      id
      content
      user
    }
  }
`;

const POST_MESSAGE = gql`
  mutation ($user: String!, $content: String!) {
    postMessage(user: $user, content: $content)
  }
`;

const Messages = ({ user }) => {
  const { data } = useSubscription(GET_MESSAGES);
  if (!data) return null;
  return (
    <>
      {data.messages.map(({ id, user: messageUser, content }) => (
        <div
          style={{
            display: 'flex',
            justifyContent: user === messageUser ? 'flex-end' : 'flex-start',
            paddingBottom: '1em',
          }}
        >
          {user !== messageUser && (
            <div
              style={{
                height: 50,
                width: 50,
                marginRight: '0.5em',
                border: '2px solid',
                borderRadius: 25,
                fontSize: '14pt',
                textAlign: 'center',
                paddingTop: 10,
              }}
            >
              {messageUser.slice(0, 3).toUpperCase()}
            </div>
          )}
          <div
            style={{
              background: user === messageUser ? '#006A4E' : 'lightgrey',
              color: user === messageUser ? 'white' : 'black',
              padding: '1em',
              borderRadius: '1em',
              maxWidth: '60%',
            }}
          >
            {content}
          </div>
        </div>
      ))}
    </>
  );
};

const Chat = () => {
  const [state, setState] = useState({ user: 'Ian', content: '' });
  const [postMessage] = useMutation(POST_MESSAGE);

  const onSend = () => {
    if (state.content.length > 0) {
      postMessage({
        variables: state,
      });
    }
    setState({ ...state, content: '' });
  };

  return (
    <Container>
      <h1 style={{ paddingTop: 20 }}>Chat App</h1>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem
        nesciunt dicta et excepturi quisquam provident. Aspernatur, nihil!
        Repudiandae id fugit assumenda? Earum, ratione quae maiores iusto maxime
        necessitatibus possimus placeat deserunt sed consectetur suscipit. Autem
        soluta ipsa architecto error fuga.
      </p>
      <Messages user={state.user} />
      <Row>
        <Col xs={2} style={{ padding: 0 }}>
          <FormInput
            label="User"
            value={state.user}
            onChange={(e) =>
              setState({
                ...state,
                user: e.target.value,
              })
            }
          />
        </Col>
        <Col xs={8}>
          <FormInput
            label="Content"
            value={state.content}
            onChange={(e) =>
              setState({
                ...state,
                content: e.target.value,
              })
            }
            onKeyUp={(e) => {
              if (e.keyCode === 13) {
                onSend();
              }
            }}
          />
        </Col>
        <Col xs={2} style={{ padding: 0 }}>
          <Button onClick={() => onSend()} style={{ width: '100%' }}>
            Send
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default () => (
  <ApolloProvider client={client}>
    <Chat />
  </ApolloProvider>
);
