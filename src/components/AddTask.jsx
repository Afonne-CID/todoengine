import { useState } from 'react'
import { saveTaskToDatabase } from '../helpers'
import { useStatus } from '../helpers/errorContext'
import Button from './Button'


const AddTask = ({ session, onAction }) => {

    const { setError } = useStatus();
    const { setSuccess } = useStatus();

    const [clickedAddButton, setClickedAddButton] = useState(false)
    const [taskTitle, setTaskTitle] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [taskCategory, setTaskCategory] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    const handleAddTask = async () => {

        setIsLoading(true)
        if(!taskTitle) {
            alert('Task title is required')
            setIsLoading(false)
        } else {

            const taskData = {
              user_id: session ? session.user.id : null,
              title: taskTitle,
              description: taskDescription,
              category: taskCategory,
              completed: false,
            }
    
            const taskSaveStatus = await saveTaskToDatabase(session, taskData)
            await onAction()
            
            setIsLoading(false)
            if (!taskSaveStatus) {
                setSuccess('Success')
            } else {
                setError(taskSaveStatus.message)
            }
        
            setClickedAddButton(false)
            setTaskTitle('')
            setTaskDescription('')
            setTaskCategory('')
            setIsLoading(false)
        }
    }   

    return (
        <div className='flex flex-col justify-center items-center'>
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                </div>
            )}
            <div className='flex flex-row justify-center w-[100%]'>
                <input 
                    type="text" 
                    name="title" 
                    value={taskTitle}
                    placeholder='task title'
                    className='mt-6 mb-4 p-2 w-[60%] bg-transparent outline-none border-black border-b-[1px]'
                    onChange={(e) => setTaskTitle(e.target.value)}
                />
                {!clickedAddButton && <Button title='ADD' onClick={() => setClickedAddButton(true)} />}
            </div>
            {clickedAddButton && (
                <div className='flex flex-col items-center justify-center w-[100%]'>
                    <input 
                        type="text"
                        name="description" 
                        value={taskDescription}
                        placeholder='task description (optional)'
                        className='p-2 w-[60%] bg-transparent outline-none border-black border-b-[1px]'
                        onChange={(e) => setTaskDescription(e.target.value)}
                    />
                    <input 
                        type="text"
                        name="category" 
                        value={taskCategory}
                        placeholder='task category (optional)'
                        className='mt-4 p-2 w-[60%] bg-transparent outline-none border-black border-b-[1px]'
                        onChange={(e) => setTaskCategory(e.target.value)}
                    />
                    <div className='flex flex-row justify-center'>
                        <div className=''>
                            <Button title='CLOSE'
                                buttonColor='bg-red-500'
                                onClick={() => {
                                    setClickedAddButton(false); 
                                    setTaskTitle('');
                                    setTaskDescription('');
                                    setTaskCategory('');
                                }}
                            />
                        </div>
                        <div className='ml-4'>
                            <Button 
                                title='ADD'
                                buttonColor='bg-green-500'
                                onClick={handleAddTask}
                            />
                            </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AddTask
