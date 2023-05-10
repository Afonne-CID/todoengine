import React, { useEffect, useState } from 'react'
import { BsFillCaretDownFill } from 'react-icons/bs'
import { fetchCompletedTasks, fetchIncompleteTasks } from './helpers'
import AuthButtons from './components/AuthButtons'
import AddTask from './components/AddTask'
import Task from './components/Task'
import Modal from './components/Modal'


const App = () => {

  const [completedTasks, setCompletedTasks] = useState([])
  const [incompleteTasks, setIncompleteTasks] = useState([])

  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const openIncompleteModal = () => setShowIncompleteModal(true);
  const openCompletedModal = () => setShowCompletedModal(true);
  const closeIncompleteModal = () => setShowIncompleteModal(false);
  const closeCompletedModal = () => setShowCompletedModal(false);

  const renderTasks = ({ tasks, bgColor, limit = null }) => {
    if (!tasks) {
      return null;
    }

    let slicedTasks = tasks;
    if (limit) {
      slicedTasks = tasks.slice(0, limit);
    }
  
    return slicedTasks.map((task, index) => {
      return (
        <Task task={task} sn={index} bgColor={bgColor} key={index} onAction={fetchData} />
      )
  });
  };
  

  const fetchData = async () => {
    const completed = await fetchCompletedTasks()
    const incomplete = await fetchIncompleteTasks()

    setCompletedTasks(completed)
    setIncompleteTasks(incomplete)
  }

  useEffect(() => {
    fetchData()
  }, [])


  return (
    <div className='h-screen w-screen bg-gradient-to-br from-[#44D9F9] via-pink-500 to-red-500 flex flex-col justify-center items-center'>

      <div className='flex flex-col items-center w-[100%] h-[100%]'>

        <div className='flex justify-end self-end mt-6 mr-6'>
            <AuthButtons />
        </div>
        
        <div className='flex justify-center mb-2 pl-4'>
            <h1 className='flex flex-1 font-bold text-[32px] text-bl font-poppins text-white'>TodoEngine - TASK MANAGEMENT APP</h1>
        </div>

        <div className='shadow bg-gradient-to-br from-[#44D9F9] via-pink-400 to-red-400 w-full sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-6/12 2xl:w-4/12 h-auto sm:h-[75%] flex flex-col justify-center items-center'>
          <div className='items-center justify-center h-[100%] w-[100%]'>
              <div className='text-center'>
                  <AddTask onAddTask={fetchData} />
              </div>
              <div className='text-center mt-6 mb-2'>
                  <p className='font-bold text-[22px] text-bl font-poppins text-white'>NOT COMPLETED</p>
                  {incompleteTasks && (
                      <>
                        {renderTasks({
                          tasks: incompleteTasks, 
                          bgColor: 'bg-red-400', 
                          limit: 2}
                        )}
                        {incompleteTasks.length > 2 && (
                          <div className='flex justify-center'>
                            <button
                                className='flex items-center mt-2 text-white'
                                onClick={openIncompleteModal}
                            >
                              More...
                              <BsFillCaretDownFill size={20} />
                            </button>
                          </div>
                        )}
                      </>
                    )
                  }

                 <Modal closeModal={closeIncompleteModal} showModal={showIncompleteModal}>
                  {renderTasks({tasks: incompleteTasks, bgColor: 'bg-red-400'})}
                 </Modal>

                 {(!incompleteTasks || incompleteTasks.length <= 0) && (
                    <small>All tasks have been completed, congratulations :)...</small>
                  )
                 }
              </div>
              <div className='text-center mb-6'>
                  <p className='font-bold text-[22px] text-bl font-poppins text-white'>COMPLETED</p>
                  {completedTasks && (
                      <>
                        {renderTasks({
                          tasks: completedTasks, 
                          bgColor: 'bg-green-400', 
                          limit: 2})
                        }
                        {completedTasks.length > 2 && (
                          <div className='flex justify-center'>
                            <button
                                className='flex items-center mt-2 text-white'
                                onClick={openCompletedModal}
                            >
                              More...
                              <BsFillCaretDownFill size={20} />
                            </button>
                          </div>
                        )}

                      </>
                    )
                  }

                 <Modal closeModal={closeCompletedModal} showModal={showCompletedModal}>
                  {renderTasks({tasks: completedTasks, bgColor: 'bg-green-400'})}
                 </Modal>

                  {(!completedTasks || completedTasks.length <= 0) && (
                    <small>No completed tasks found, create new tasks...</small>
                  )
                 }
              </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default App
