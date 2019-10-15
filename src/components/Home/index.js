import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { AuthUserContext, withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import TodayIcon from '@material-ui/icons/Today';
import AddEditTaskDialog from '../AddEditTaskDialog';
import { DAY_FORMAT } from '../../constants/dates';
import { blue } from '../../constants/colors';
import TasksList from '../TasksList';
import { compose } from 'recompose';
import { TODAY } from '../../constants/dates';
import Spinner from '../Spinner';
import NoTasks from '../NoTasks';

const Separator = styled.div`
  padding: 5px 20px;
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  background: ${blue};
  border-radius: 4px;
  margin: 0 10px;
`;

const StyledTodayIcon = styled(TodayIcon)`
  vertical-align: middle;
  &.MuiSvgIcon-root {
    margin-right: 5px;
    margin-top: -4px;
    width: 24px;
    height: 24px;
  }
`;

const getTasksList = (taskObject) => {
  return Object.keys(taskObject).map(key => ({
    ...taskObject[key],
    uid: key,
  })).reverse();
};

const groupTasksByDay = (tasksList) => {
  return tasksList.reduce((res, item) => {
    if (!res[item.day]) res[item.day] = [];
    res[item.day].push(item);
    return res;
  }, {});
};

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      loading: false,
      tasks: [],
      groupedList: {},
      edit: null,
      open: false
    };
  }

  onEditTask = (task) => {
    this.setState({ ...this.state, edit: task });
  };

  createTask = () => {
    this.setState({ ...this.state, open: true });
  };

  onStopEdit = () => {
    this.setState({ ...this.state, edit: null, open: false });
  };

  componentDidMount() {
    const { firebase } = this.props;
    this.setState({ loading: true });

    firebase.tasks().on('value', snapshot => {

      // Убрать этот костыль - новый таск создается позже чем срабатывает это событие!
      // надо просто вручную вызывать обновление списка!!!! (не обновляется после EDIT!!!!)
      setTimeout(() => {
        const taskObject = snapshot.val();
        if (taskObject) {
          const tasksList = getTasksList(taskObject);
          const groupedList = groupTasksByDay(tasksList);
          this.setState({ ...this.state, groupedList, tasks: tasksList, loading: false });
        } else {
          this.setState({ tasks: null, loading: false });
        }
      }, 500);
      // ====================================================

    });
  }

  componentWillUnmount() {
    const { firebase } = this.props;
    firebase.tasks().off();
  }

  render() {
    const { tasks, loading, groupedList, edit, open } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <AddEditTaskDialog
              edit={edit}
              outerOpen={open}
              userId={authUser.uid}
              onStopEdit={ this.onStopEdit }
            />

            { loading && <Spinner /> }

            {
              tasks ? (
                Object.keys(groupedList).map((key) => (
                  <Fragment key={key}>
                    <Separator>
                      <StyledTodayIcon />
                      { moment(key, DAY_FORMAT).format(TODAY) }
                    </Separator>
                    <TasksList
                      tasks={groupedList[key]}
                      onEditTask={this.onEditTask}
                    />
                  </Fragment>
                ))
              ) : (
                <NoTasks create={ this.createTask }/>
              )
            }
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const condition = authUser => !!authUser;

export default compose(
  withFirebase,
  withAuthorization(condition),
)(HomePage);