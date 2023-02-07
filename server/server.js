const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const app = express();

app.use(cors());
app.use(express.json());

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
}); 

const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'cheese',
    database: 'todo_app'

});

client.connect((err) => {
    if (err) {
        console.log(`Failed to connect to the database: ${err}`);
    } else {
        console.log("succesfully connected to the database")
    }
});

app.get('/tasks', (req, res) => {
    client.query('SELECT * FROM tasks', (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(result.rows)
        }
    })
})

app.post('/addTask', (req, res) => {
    const task = req.body;

    const sql = 'INSERT INTO tasks (id, title, completed) VALUES ($1, $2, $3)';
    const values = [task.id, task.title, task.completed];

    client.query(sql, values).then(() => {
        res.json({ message: 'Task added succesfully' });
    })
    .catch((error) => {
        console.error(error);
        res.status(500).json({message: 'An error ocurred'});
    });
});

app.put('/updateTask/:id', (req, res) => {
    const taskId = req.params.id;
    const {title} = req.body

    const sql = 'UPDATE tasks SET title=$1 WHERE id=$2';
    const values = [title, taskId];

    client.query(sql, values, (err, result) => {
     if (err) {
        res.status(500).json({error:err.message});
     } else {
        res.status(200).json({message:'Task text updated'});
     }
    });
});

app.put('/completeTask/:id', (req, res) => {
    const taskId = req.params.id;
    const {completed} = req.body

    const sql = 'UPDATE tasks SET completed=$1 WHERE id=$3';
    const values = [completed, taskId];

    client.query(sql, values, (err, result) => {
        if (err) {
            res.status(500).json({error:err.message});
        } else {
            res.status(200).json({message: 'Completed updated'});
        }
    });
})

app.delete('/deleteTask/:id', (req, res) => {
    const taskId = req.params.id;

    client.query(`DELETE FROM tasks WHERE id = '${taskId}'`, (error, result) => {
        if (error) {
            res.status(400).send({
                success: false, 
                message: error.message
            });
        } else {
            res.status(200).send({
                success:true, 
                message:'Task deleted succesfully'
            });
        }
    })
})


//routes for json file//
    app.delete('/deleteTask/:id', (req, res) => {
        const taskId = req.params.id;

        fs.readFile(filePath, 'utf8', (err, data) => {
            if(err) {
                console.error(err);
            res.status(500).send('Error reading tasks file');
                return;
            }
            let tasks = JSON.parse(data);

            tasks = tasks.filter(task => task.id !== taskId);

            fs.writeFile(filePath, JSON.stringify(tasks), (err) => {
                if(err) {
            res.status(500).send({error:'Error updating tasks file'});
                    return;
                }
                res.send({message:'Task was deleted'});
            });
        });
    });
