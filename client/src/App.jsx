import React from "react";
import NavBar from "./components/NavBar";

// New - import the React Router components, and the Profile page component
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Profile from "./Pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import Home from './Pages/Home';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
const { Header, Content } = Layout;


function App() {
  return (
    <div className="App">
      {/* New - use BrowserRouter to provide access to /profile */}
      <BrowserRouter>
        <Layout>
          <Header>
            <NavBar />
          </Header>
          <Content style={{ padding: '0 50px', minHeight: '80vh' }}>
            <Switch>
              <Route path="/" exact component={Home} />
              <PrivateRoute exact path="/profile" component={Profile} />
            </Switch>
          </Content>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
