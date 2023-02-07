function Tasks({tasks, deleteTask, handleEdit, markComplete}) {

  return (
    <div>
        <ul>
          {tasks.map((task) => (
            <><li key={task.id}>{task.title}</li>
            <button onClick={() => handleEdit(task.id)}>Edit</button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
            <button onClick={() => markComplete(task.id)}>Completed</button>
            </>
          ))}
        </ul>
    </div>
  )
  
}


export default Tasks