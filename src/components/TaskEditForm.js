import { useState } from "react";

function TaskEditForm({task, handleUpdate}) {
const [newTask, setNewTask] = useState(task);

const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate(newTask)
}

  return (
    <div>
          <form onSubmit={handleSubmit}>
            <input 
            type='text' 
            value = {newTask}
            onChange = {(e) => setNewTask(e.target.value)}
            />
            <button type="submit">Save</button>
            
          </form>
    </div>
  )
}

export default TaskEditForm