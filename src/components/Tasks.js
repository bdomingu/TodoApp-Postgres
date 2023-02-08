function Tasks({tasks, deleteTask, handleEdit, markComplete, setCurrentPage, currentPage, totalPages}) {

  return (
    <div>
          {tasks.map((task) => (
            <><li key={task.id}>{task.title}</li>
            <button onClick={() => handleEdit(task.id)}>Edit</button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
            <button onClick={() => markComplete(task.id)}>Completed</button>
            </>
          ))}
          <div>
            {currentPage > 1 && (
              <button onClick={() => setCurrentPage(currentPage -1)}>
                Previous</button>
            )}
            {currentPage < totalPages && (
              <button onClick={() => setCurrentPage(currentPage + 1)}>
                Next</button>
            )}
          </div>
     
    </div>
  )
  
}


export default Tasks