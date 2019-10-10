import React, { Component } from 'react';
import { AuthUserContext, withAuthorization } from '../Session';
import styled from 'styled-components';
import moment from 'moment';

import AddEditTaskDialog from '../AddEditTaskDialog';

import { withFirebase } from '../Firebase';

import TaskItem from '../TaskItem';
import { DAY_FORMAT } from '../../constants/dates';

import { blue } from '../../constants/colors';

const Separator = styled.div`
  padding: 5px 20px;
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  background: ${blue};
  border-radius: 4px;
  margin: 0 10px;
`;


const HomePage = () => (
  <div>
    <Tasks />
  </div>
);


// ================
class TasksBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      loading: false,
      tasks: [],
      groupedList: {},
      edit: null
    };

  }

  onRemoveTask = (uid) => {
    this.props.firebase.task(uid).remove();
  };

  onEditTask = (task) => {
    this.setState({ ...this.state, edit: task });
  };

  onStopEdit = () => {
    this.setState({ ...this.state, edit: null });
  };

  componentDidMount() {
    this.setState({ loading: true });

    // GET TASKS LIST this.db.ref('tasks')
    this.props.firebase.tasks().on('value', snapshot => {

      // Убрать этот костыль - новый таск создается позже чем срабатывает это событие!
      // надо просто вручную вызывать обновление списка!!!!
      setTimeout(() => {

      console.log('[FIREBASE ON.VALUE EVENT HANDLER] >>>>>>', snapshot);
      const taskObject = snapshot.val();

      if (taskObject) {
        const tasksList = Object.keys(taskObject).map(key => ({
          ...taskObject[key],
          uid: key,
        })).reverse();

        // Group tasks by day
        const groupedList = tasksList.reduce((res, item) => {
          if (!res[item.day]) res[item.day] = [];
          res[item.day].push(item);
          return res;
        }, {});

        this.setState({ ...this.state, groupedList, tasks: tasksList, loading: false });
        // this.setState({ tasks: tasksList, loading: false });
      } else {
        this.setState({ tasks: null, loading: false });
      }

      }, 500);

    });

  }
  componentWillUnmount() {
    this.props.firebase.tasks().off();
  }

  createTask = (data, authUser) => {
    this.props.firebase.tasks().push({
      ...data,
      userId: authUser.uid,
      createdAt: this.props.firebase.serverValue.TIMESTAMP, // 1569481851697
    }).then((res) => {
      console.log('TASK CREATED!!! >>>>>>', res);
    }).catch((err) => {
      console.log('ERROR: ', err);
    });
  };

  onCloneTask = (task) => {
    const data = {
      name: task.name,
      title: task.title,
      link: task.link,
      branch: task.branch,
      notes: task.notes,
      status: 'to_do',
      day: moment().format(DAY_FORMAT),
      userId: task.userId,
    };
    this.props.firebase.tasks().push({
      ...data,
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
    }).then((res) => {
      console.log('TASK CLONED!!! >>>>>>', res);
    }).catch((err) => {
      console.log('ERROR: ', err);
    });
  };

  render() {
    const { tasks, loading, groupedList, edit } = this.state;

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // TODO: ПОЧЕМУ БЛЯДЬ ЭТО ВВОДИТСЯ 5-3 РАЗА?????????????????????????????????????? и больше
    // может быть как количество дней???? как-то не мутируется?
    // console.log('?? >>>>>>', groupedList);
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>

            {/*<TaskForm submit={(data) => { this.createTask(data, authUser) }}/>*/}
            <AddEditTaskDialog
              edit={edit}
              userId={authUser.uid}
              onStopEdit={ this.onStopEdit }
              submit={(data) => { this.createTask(data, authUser) }}
            />

            {loading && <div>Loading ...</div>}

            {
              tasks ?
                (
                  Object.keys(groupedList).map((key) => (
                    <div key={key}>

                      <Separator>{ moment(key, DAY_FORMAT).format('DD.MM.YYYY dddd') }</Separator>


                      {groupedList[key] ? (
                        <TasksList
                          tasks={groupedList[key]}
                          onRemoveTask={this.onRemoveTask}
                          onEditTask={this.onEditTask}
                          onCloneTask={this.onCloneTask}
                        />
                        ) : (
                        <div>There are no tasks ...</div>
                      )}



                    </div>
                  ))
                ) : (
                  <div>No data ...</div>
                )
            }
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const Tasks = withFirebase(TasksBase);

const TasksList = ({ tasks, onRemoveTask, onEditTask, onCloneTask }) => (
  <div>
    {tasks.map(task => (
      <TaskItem
        key={task.uid}
        task={task}
        onRemoveTask={onRemoveTask}
        onEditTask={onEditTask}
        onCloneTask={onCloneTask}
      />
    ))}
  </div>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);