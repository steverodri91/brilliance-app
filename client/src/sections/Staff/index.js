import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import CollectionPage from "../../components/CollectionPage";
import { employeeRequests as employee } from "../../services/railsServer.js";
import axios from "axios";

export default class Staff extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staff: [],
      page: 1
    };
    this.axiosRequestSource = axios.CancelToken.source();
    this.ajaxOptions = {
      cancelToken: this.axiosRequestSource.token,
      unauthorizedCB: this.props.signout,
      sendCount: true
    };
    this.itemsPerPage = 25;
  }

  updateColumnHeaders = e => {
    const width = window.innerWidth;
    if (width < 500) {
      this.setState({
        columnHeaders: null
      });
    } else if (width < 700) {
      this.setState({
        columnHeaders: ["name", "", "", "active", "labor"]
      });
    } else {
      this.setState({
        columnHeaders: ["name", "", "", "active", "labor"]
      });
    }
  };

  async componentDidMount() {
    const { setView, location, changeNav } = this.props;
    if (location && location.state && !location.state.nav) changeNav(false);
    await setView("Workers");
    await this.setColumnHeaders();
    await this.setStaff();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColumnHeaders);
    this.axiosRequestSource && this.axiosRequestSource.cancel();
  }

  setColumnHeaders = () => {
    this.updateColumnHeaders();
    window.addEventListener("resize", this.updateColumnHeaders);
  };

  setStaff = async () => {
    await this.resetStaff();
    await this.fetchStaff();
  };

  fetchStaff = async () => {
    const { page, staff } = this.state;
    if ((staff.length + this.itemsPerPage) / page <= this.itemsPerPage) {
      const workers = await employee.batch({ page }, this.ajaxOptions);
      if (workers && workers.length) await this.updateStaff(workers);
    }
  };

  resetStaff = async () => {
    this.setState({ staff: [] });
  };

  updateStaff = async workers => {
    const { page } = this.state;
    let staff = [...this.state.staff];
    if ((staff.length + this.itemsPerPage) / page <= this.itemsPerPage) {
      workers.forEach(w => staff.push(w));

      if (workers.length < 25) {
        this.setState({
          staff,
          hasMore: false
        });
      } else {
        this.setState(prevState => ({
          staff,
          hasMore: true,
          page: prevState.page + 1
        }));
      }
    }
  };

  List = props => {
    const { staff } = this.state;
    return (
      <CollectionPage
        {...this.props}
        {...this.state}
        {...props}
        title="Staff"
        data={staff}
        load={this.fetchStaff}
      />
    );
  };

  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route exact path={match.path} render={props => this.List(props)} />
      </Switch>
    );
  }
}
