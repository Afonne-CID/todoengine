import { supabase } from "./supabase"

const getUser = async (session) => {
    try {
        if(session) {
            const { data: { user } } = await supabase.auth.getUser();
            return user
        }
    } catch (error) {
        return error
    }
}

const deleteTask = async (session, taskId) => {
    try {
        if(session) {
            const { error } = await supabase.from('task').delete().eq('id', taskId);
            if (error) {
                return error
            }
        } else {
            const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
            const updatedTasks = tasks.filter((task) => task.id !== taskId)
            localStorage.setItem('tasks', JSON.stringify(updatedTasks))
        }
    } catch (error) {
        return error
    }
}

const updateTask = async (session, updatedTaskData, taskId) => {
    try {
        if(session) {
            try {
                console.log(updatedTaskData, taskId)
                const { error } = await supabase.from('task').update(updatedTaskData).eq('id', taskId);
                if (error) {
                    return error;
                }
            } catch (error) {
                console.error('Error in try-catch block:', error);
            }  
        } else {
            const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
            const updatedTasks = tasks.map((task) => task.id === taskId ? updatedTaskData : task)
            localStorage.setItem('tasks', JSON.stringify(updatedTasks))
        }
    } catch (error) {
        return error
    }
}

const toggleTaskCompletion = async (session, task) => {
    try {
        if (session) {
            task.completed = !task.completed;
            const { error } = await supabase.from('task').update(task).eq('id', task.id);
            if (error) {
                return error
            }
        } else {
            const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            const taskIndex = tasks.findIndex(task => task.id === task.id);
            if (taskIndex !== -1) {
                tasks[taskIndex].completed = !tasks[taskIndex].completed;
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
        }
    } catch (error) {
        return error
    }
}

const fetchFromLocalStorage = (completed) => {
    try {
        localStorage.getItem('tasks') == 'undefined' ? localStorage.setItem('tasks', '[]') : localStorage.getItem('tasks')
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
        return tasks.filter(task => task.completed === completed)
    } catch (error) {
        return error
    }
}

const fetchCompletedTasks = async (session) => {
    try {
        if(session) {
            try {
                const { data, error } = await supabase.from('task').select().eq('completed', true);
                
                if (error) {
                    return error;
                } else {
                    return data
                }
            } catch (error) {
                console.error('Error in try-catch block:', error);
            }        
        } else {
            return fetchFromLocalStorage(true)
        }
    } catch (error) {
        return error
    }
}

const fetchIncompleteTasks = async (session) => {
    try {
        if(session) {
            try {
                const { data, error } = await supabase.from('task').select().eq('completed', false);
                
                if (error) {
                    return error;
                } else {
                    return data
                }
            } catch (error) {
                console.error('Error in try-catch block:', error);
            }
            
        } else {
            return fetchFromLocalStorage(false)
        }
    } catch (error) {
        return error
    }
}

const saveToLocalStorage = (taskData) => {
    try {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
        tasks.push({ ...taskData, id: Date.now() })
        localStorage.setItem('tasks', JSON.stringify(tasks))
    } catch (error) {
        return error
    }
}

const saveTaskToDatabase = async (session, taskData) => {
    try {
        if (session) {
            const { error } = await supabase.from('task').insert(taskData);
            if (error) {
                return error;
            }
        } else {
            saveToLocalStorage(taskData);
            fetchFromLocalStorage(false);
        }
    } catch (error) {
        throw new Error('Error here', error);
    }
}

export {
    getUser,
    fetchCompletedTasks, 
    fetchIncompleteTasks, 
    saveTaskToDatabase,
    deleteTask, 
    updateTask, 
    toggleTaskCompletion,
};
