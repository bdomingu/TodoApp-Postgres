import './App.css';
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import TaskEditForm from './components/TaskEditForm';


//Still need to figure out how to edit a task without editing all of them. I was having issues with the original .map setup 
//because the app was rendering the tasks a few times.//
function App() {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [completed, setCompleted] = useState(false)
  
useEffect(() => {
  const displayTasks = () => {
    axios.get('http://localhost:8000/tasks').then(response => {
      const data = response.data
      setTasks(data)
      console.log(tasks)
      // console.log(response.data);
    })
    .catch(error => {
      console.log(error);
    })
  }

  displayTasks();
}, [])

  const submitTask = (title) => {  
    const task = {
      id: uuidv4(),
      title: title,
      completed: completed

    }
  
    setTasks([...tasks, task])
    setCurrentTask('')
   
    axios.post('http://localhost:8000/addTask', task).then(response => {
      console.log(response.data);
    })
      .catch(error => {
        console.log(error);
      })   
    
      
  } 


  const handleEdit = (taskId) => {
    setEditingTaskId(taskId)
  }


  const handleUpdate = (newTask) => { 
    const updatedTasks = tasks.map(task => {
      if (task.id === editingTaskId) {
        axios.put(`http://localhost:8000/updateTask/${task.id}`, {title:newTask}).then(response => {
          console.log(response.data);
        })
          .catch(error => {
            console.log(error);
          }) 
        return {...task, title:newTask};
      } 
      return task;
    });
    setTasks(updatedTasks);
    setEditingTaskId(null); 

  }
  
 
  //The completed is updating after a second click of the "completed" button//
  //Need to figure out a better solution so it updates immediately.//
  //Ned to still figure out why it is not updating the "completed" section in the database//
  const markComplete = (id) => {
    setCompleted(true)
    
    const completedTasks = tasks.map(task => {
      return {...task, completed:completed};
    })
    
    setTasks(completedTasks)
    
    axios.put(`http://localhost:8000/completeTask/${id}`, {completed:completed}).then(response => {
      console.log(response.data);
    })
      .catch(error => {
        console.log(error);
      })

    //*code that was actually updating right away*//
         // const updatedCompleted = tasks.map(task => {
    //   if (task.id === id ){

    //   return {...task, completed:true}
    //   }
    // });
    // setTasks(updatedCompleted);
  }

  console.log(tasks)
  const deleteTask = (id) => {
    const newTasks = tasks.filter(task => task.id !== id );
    setTasks(newTasks)
    axios.delete(`http://localhost:8000/deleteTask/${id}`).then(response => { 
      console.log(response.data);
    })
      .catch(error => {
        console.log(error);
      })
   
      
}
  return (
    <div className="App">
      <h1>Todo App</h1>
      <AddTask currentTask={currentTask} setCurrentTask={setCurrentTask} submitTask={submitTask}/>
      <Tasks tasks={tasks} deleteTask={deleteTask} markComplete={markComplete} handleEdit={handleEdit}/>
     
      
    </div>
  );
}

export default App;


// {tasks.map(task => (
//   <div>
//    {editingTaskId === task.id ? <>
//     <TaskEditForm task={task.title} handleUpdate={handleUpdate}/></>: <Tasks tasks={tasks} deleteTask={deleteTask} markComplete={markComplete} handleEdit={handleEdit}/>
//   }
//   </div>
// ))}