import { useState } from 'react'
import { useStatus } from '../helpers/errorContext'
import { updateTask } from '../helpers'
import Button from './Button'


const UpdateTaskComponent = ({ session, task, onAction, formStatus }) => {

    const { setError } = useStatus();
    const { setSuccess } = useStatus();
    const [isLoading, setIsLoading] = useState(false);

    const [taskUpdateTitle, setTaskUpdateTitle] = useState(task.title)
    const [taskUpdateDescription, setTaskUpdateDescription] = useState(task.description)
    const [taskUpdateCategory, setTaskUpateCategory] = useState(task.category)
    const [updateCompleted, setUpdateCompleted] = useState(task.completed)

    const handleUpdateTask = async () => {
        setIsLoading(true)
        if(!taskUpdateTitle) {
            alert('Task title is required')
        } else {
            const taskData = {
              title: taskUpdateTitle,
              description: taskUpdateDescription,
              category: taskUpdateCategory,
              completed: updateCompleted,
            }
    
            console.log('Properties of task', task)

            const updateStatus = await updateTask(session, taskData, task.id)
            await onAction()

            if (!updateStatus) {
                setSuccess('Update successful')
            } else {
                setError(updateStatus.message)
            }
    
            setTaskUpdateTitle('')
            setTaskUpdateDescription('')
            setTaskUpateCategory('')
            setUpdateCompleted(false)
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
                value={taskUpdateTitle}
                placeholder='task title'
                className='mb-4 p-2 w-full bg-transparent outline-none border-black border-b-[1px]'
                onChange={(e) => setTaskUpdateTitle(e.target.value)}
            />
            <input 
                type="text"
                name="description" 
                value={taskUpdateDescription}
                placeholder='task description (optional)'
                className='p-2 w-full bg-transparent outline-none border-black border-b-[1px]'
                onChange={(e) => setTaskUpdateDescription(e.target.value)}
            />
            <input 
                type="text"
                name="category" 
                value={taskUpdateCategory}
                placeholder='task category (optional)'
                className='mt-4 p-2 w-full bg-transparent outline-none border-black border-b-[1px]'
                onChange={(e) => setTaskUpateCategory(e.target.value)}
            />
            <div className='flex flex-row justify-center'>
                <div className=''>
                    <Button title='CLOSE'
                        buttonColor='bg-red-500'
                        onClick={() => {
                            setTaskUpdateTitle('')
                            setTaskUpdateDescription('')
                            setTaskUpateCategory('')
                            setUpdateCompleted(false)
                            formStatus(false)
                        }}
                    />
                </div>
                <div className='ml-4'>
                    <Button 
                        title='UPDATE'
                        buttonColor='bg-green-500'
                        onClick={() => {
                            handleUpdateTask()
                            formStatus(false)
                        }}
                    />
                    </div>
            </div>
        </div>
    )
}

export default UpdateTaskComponent
