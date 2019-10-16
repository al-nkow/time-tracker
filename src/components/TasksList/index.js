import React from 'react';
import TaskItem from '../TaskItem';

const TasksList = ({ tasks, onEditTask }) => {
  if (!tasks) return <div>There are no tasks ...</div>;

  return (
    <div>
      {tasks.map(task => (
        <TaskItem
          key={task.uid}
          task={task}
          onEditTask={onEditTask}
        />
      ))}
    </div>
  );
};

export default TasksList;
