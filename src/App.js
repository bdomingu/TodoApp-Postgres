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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // const batchSize = 100;
  const pageSize = 10;

useEffect(() => {
  const fetchTasks = async () => {
    const response = await axios.get
    (`http://localhost:8000/tasks?page=${currentPage}&pageSize=${pageSize}`);
      setTasks(response.data.data)
      setTotalPages(Math.ceil(response.data.totalCount / 10))
      
  }
 
  fetchTasks()
}, [currentPage])

console.log(tasks)
  // async function getBatchData(batchNumber, batchSize) {
  //   try {
  //     const response = await axios.get(`http://localhost:8000/batch-processing/${batchNumber}${batchSize}`);
  //      console.log(response.data);
  //   } catch (error) {
  //     console.error(error);
  //     return [];
  //   }
  // }

  // getBatchData(1, 10)
  // getBatchData(2, 10)

  const submitTask = (title) => {  
    const task = {
      id: uuidv4(),
      title: title,
      completed: true

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
  
 
  
  const markComplete = (id) => {
    
   axios.patch(`http://localhost:8000/completeTask/${id}`, {completed:true}).then(response => {
      console.log(response.data);

    })
      .catch(error => {
        console.log(error);
      })
   
  }

 
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
      <Tasks totalPages={totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage} tasks={tasks} deleteTask={deleteTask} markComplete={markComplete} handleEdit={handleEdit}/>
     
      
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