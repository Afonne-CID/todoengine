import React, { useState } from 'react'
import Select from 'react-select';
import { updateTask } from '../helpers'
import Button from './Button'


const UpdateTaskComponent = ({ task, onAction }) => {

    const [taskTitle, setTaskTitle] = useState(task.title)
    const [taskDescription, setTaskDescription] = useState(task.description)
    const [taskCategory, setTaskCategory] = useState(task.category)
    const [completed, setCompleted] = useState(task.completed)
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateTask = async () => {
        setIsLoading(true)
        if(!taskTitle) {
            alert('Task title is required')
        } else {
            const taskData = {
              title: taskTitle,
              description: taskDescription,
              category: taskCategory,
              completed: completed,
            }
    
            await updateTask(task.id, taskData)
            await onAction()
    
            setTaskTitle('')
            setTaskDescription('')
            setTaskCategory('')
            setCompleted(false)
            setIsLoading(false)
        }
      }

    return (
        <div className='flex flex-col justify-center w-[80%]'>

            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                </div>
            )}

            <input 
                type="text" 
                name="title" 
                value={taskTitle}
                placeholder='task title'
                className='mb-4 p-2 w-full bg-transparent outline-none border-black border-b-[1px]'
                onChange={(e) => setTaskTitle(e.target.value)}
            />
            <input 
                type="text"
                name="description" 
                value={taskDescription}
                placeholder='task description (optional)'
                className='p-2 w-full bg-transparent outline-none border-black border-b-[1px]'
                onChange={(e) => setTaskDescription(e.target.value)}
            />
            <input 
                type="text"
                name="category" 
                value={taskCategory}
                placeholder='task category (optional)'
                className='mt-4 p-2 w-full bg-transparent outline-none border-black border-b-[1px]'
                onChange={(e) => setTaskCategory(e.target.value)}
            />
            <div className='flex flex-row justify-center'>
                <div className=''>
                    <Button title='CLOSE'
                        buttonColor='bg-red-500'
                        onClick={() => {
                            onAction();
                            setTaskTitle('')
                            setTaskDescription('')
                            setTaskCategory('')
                            setCompleted(false)
                        }}
                    />
                </div>
                <div className='ml-4'>
                    <Button 
                        title='UPDATE'
                        buttonColor='bg-green-500'
                        onClick={handleUpdateTask}
                    />
                    </div>
            </div>
        </div>
    )
}

export default UpdateTaskComponent
