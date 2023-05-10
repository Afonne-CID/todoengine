
// const tasks_api_url = '/api/tasks/'
// const categories_api_url = '/api/categories/'
const API_URL = import.meta.env.VITE_API_URL || '/api';
console.log(API_URL)

const isAuthenticated = () => {
    return ((localStorage.getItem('token', null) !== null) && (localStorage.getItem('token', null) !== undefined))
}

const getCategories = async () => {
    if(isAuthenticated()) {
        const response = await fetch(`${API_URL}/categories/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token', null)}`
            }
        })

        if(response.ok) {
            return await response.json()
        } else {
            if(response.status === 401) {
                localStorage.setItem('token', null)
                return []
            }

            throw new Error('Failed to fetch categories')
        }

    } else {
        return []
    }
}

const deleteTask = async (taskId) => {
    if(isAuthenticated()) {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${localStorage.getItem('token', null)}`
            }
        })

        if(!response.ok) {
            localStorage.setItem('token', null)
            const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
            const updatedTasks = tasks.filter((task) => task.id !== taskId)
            localStorage.setItem('tasks', JSON.stringify(updatedTasks))
        }

    } else {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
        const updatedTasks = tasks.filter((task) => task.id !== taskId)
        localStorage.setItem('tasks', JSON.stringify(updatedTasks))
    }
}

const updateTask = async (taskId, updatedTaskData) => {
    if(isAuthenticated()) {
        console.log(updatedTaskData.url)
        const response = await fetch(`${API_URL}/tasks/${taskId}/`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${localStorage.getItem('token', null)}`
            },
            body: JSON.stringify(updatedTaskData),
        })

        if(response.ok) {
            return await response.json()
        } else {
            if(response.status === 401) {
                localStorage.setItem('token', null)
                const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
                const updatedTasks = tasks.map((task) => task.id === taskId ? updatedTaskData : task)
                localStorage.setItem('tasks', JSON.stringify(updatedTasks))
            }
        }

    } else {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
        const updatedTasks = tasks.map((task) => task.id === taskId ? updatedTaskData : task)
        localStorage.setItem('tasks', JSON.stringify(updatedTasks))
    }
}

const toggleTaskCompletion = async (taskId) => {
    const tasks = isAuthenticated() ? await fetchIncompleteTasks() : JSON.parse(localStorage.getItem('tasks') || '[]')
    const task = tasks.find(task => task.id == taskId)
    if(task) {
        const updateTaskData = {...task, completed: !task.completed}
        await updateTask(taskId, updateTaskData)
    }
}

const fetchFromLocalStorage = (completed) => {
    localStorage.getItem('tasks') == 'undefined' ? localStorage.setItem('tasks', '[]') : localStorage.getItem('tasks')
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    return tasks.filter(task => task.completed === completed)
}

const fetchCompletedTasks = async () => {
    try {

      if(isAuthenticated()) {
            const queryParams = new URLSearchParams([
                ['completed', 'true']
            ])
        
            const response = await fetch (`${API_URL}/tasks/?${queryParams}`, {
                headers: {
                'Authorization': `Token ${localStorage.getItem('token', null)}`
                }
            })
            
            if(response.ok) {
                return await response.json()
            } else {
                if(response.status === 401) {
                    localStorage.setItem('token', null)
                    return fetchFromLocalStorage(true)
                }

                throw new Error('Failed to fetch completed tasks')
            }

      } else {
        return fetchFromLocalStorage(true)
      }

    } catch (error) {
      console.log(error)
    }
}

const fetchIncompleteTasks = async () => {
    try {
        if(isAuthenticated()) {
            const queryParams = new URLSearchParams([
                ['completed', 'false']
            ])
        
            const response = await fetch(`${API_URL}/tasks/?${queryParams}`, {
                headers: {
                'Authorization': `Token ${localStorage.getItem('token', null)}`
                }
            })
        
            if(response.ok) {
                return await response.json()
            } else {
                if(response.status === 401) {
                    localStorage.setItem('token', null)
                    return fetchFromLocalStorage(false)
                }

                throw new Error('Failed to fetch incomplete tasks')
            }

        } else {
            return fetchFromLocalStorage(false)
        }
    } catch (error) {
        console.log(error)
    }
}

const saveToLocalStorage = (taskData) => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    tasks.push({ ...taskData, id: Date.now() })
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

const saveToDatabase = async (taskData, token=null) => {
    if(isAuthenticated()) {
        const response = await fetch(`${API_URL}/tasks/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Token ${token}`,
            },
            body: JSON.stringify(taskData)
        })

        if(response.ok) {
            return await response.json()
        } else {
            if(response.status === 401) {
                localStorage.setItem('token', null)
                saveToLocalStorage(taskData);
            }            
        }

    } else {
        saveToLocalStorage(taskData)
    }
}

export { 
    fetchCompletedTasks, 
    fetchIncompleteTasks, 
    saveToDatabase, 
    deleteTask, 
    updateTask, 
    toggleTaskCompletion,
    getCategories,
};
