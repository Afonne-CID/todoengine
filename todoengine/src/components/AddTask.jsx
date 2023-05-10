import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { saveToDatabase, getCategories } from '../helpers'
import Button from './Button'


const AddTask = ({ onAddTask }) => {

    const [clickedAddButton, setClickedAddButton] = useState(false)
    const [taskTitle, setTaskTitle] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [taskCategory, setTaskCategory] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    const [categories, setCategories] = useState([])

    const handleAddTask = async () => {
        setIsLoading(true)
        if(!taskTitle) {
            alert('Task title is required')
        } else {
            const taskData = {
              title: taskTitle,
              description: taskDescription,
              category: taskCategory,
              completed: false,
            }
    
            const token = localStorage.getItem('token', null)
            await saveToDatabase(taskData, token)
    
            await onAddTask()
    
            setClickedAddButton(false)
            setTaskTitle('')
            setTaskDescription('')
            setTaskCategory('')
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getCategories()
            setCategories(data)
        }

        fetchCategories()
    }, [])

    const getSelectOptions = (categories) => {
        return categories.map((category) => ({ value: category.id, label: category.name }));
      };      

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
