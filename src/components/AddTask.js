function AddTask({currentTask, setCurrentTask, submitTask}) {
  
  
  return (
    <div>
    
            <input
             type="text"
             value={currentTask}
             onChange={e => setCurrentTask(e.target.value)}
             />

            <button onClick={() => submitTask(currentTask)}>Add Task</button>
       
    </div>
  )
}

export default AddTask