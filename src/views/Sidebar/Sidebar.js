import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Search from '../SearchView';
import UnitView from '../UnitView';

import LinkList from './components/LinkList';

const Test = () => (
  <div>
    <LinkList />
  </div>
);

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="Sidebar" style={{ height: '100%' }}>
        <Switch>
          <Route path="/:lng/unit/:unit" component={UnitView} />
          <Route path="/:lng/search" component={Search} />
          <Route path="/:lng/" component={Test} />
        </Switch>
      </div>
    );
  }
}
export default Sidebar;
