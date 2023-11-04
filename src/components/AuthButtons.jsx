import { useState, useRef, useEffect } from 'react'
import { supabase } from '../helpers/supabase'
import { useStatus } from '../helpers/errorContext'
import StatusDisplay from './StatusDisplay'
import { LoginForm, RegisterForm } from './AuthForms'


const AuthButtons = ({ session }) => {

    const { setError } = useStatus();
    const { setSuccess } = useStatus();
    // const [formStatus, setFormStatus] = useState({ success: false, error: null })
    const [isLoading, setIsLoading] = useState(false);

    const formRef = useRef(null)
    const handleClickOutside = (event) => {
        if (formRef.current && !formRef.current.contains(event.target)) {
          setShowLoginForm(false)
          setShowRegisterForm(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    const [showLoginForm, setShowLoginForm] = useState(false)
    const [showRegisterForm, setShowRegisterForm] = useState(false)

    async function handleLogout() {
        setIsLoading(true)
        await supabase.auth.signOut()
        // setFormStatus({ success: false, error: null })
        setError(null)
        setSuccess(null)
        setShowLoginForm(false)
        setIsLoading(false)
    }

    const handleLogin = async (username, password) => {
        setIsLoading(true)

        const { success, error } = await supabase.auth.signInWithPassword({
            email: username,
            password: password,
            options: {
              redirectTo: 'https://todoengine.vercel.app/'
            }
          })

        setShowLoginForm(false)
        setIsLoading(false)
        if(!error) {
            // setFormStatus({ success: true, error: null })
            setError(null)
            setSuccess(null)
            setShowLoginForm(false)
        } else {
            // setFormStatus({ success: false, error: error.message })
            setError(error.message)
            setShowLoginForm(false)
        }
        
        return success
    }
    
    const handleRegister = async (username, password) => {
        setIsLoading(true)

        const { success, error } = await supabase.auth.signUp({
            email: username,
            password: password,
            options: {
              redirectTo: 'https://todoengine.vercel.app/'
            }
          })

        setShowRegisterForm(false)
        setIsLoading(false)
        if(!error) {
            // setFormStatus({ success: true, error: null })
            setError(null)
            setSuccess(null)
            setShowRegisterForm(false)
        } else {
            // setFormStatus({ success: false, error: error.message })
            setError(error.message)
            setShowRegisterForm(false)
        }

        return success
    }

    return (
        <div>
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                </div>
            )}
            {session ? (
                <>
                    <div className="flex flex-row">
                        <div className="flex items-center mr-4 text-white">
                            Welcome
                        </div>
                        <div
                            className="cursor-pointer flex justify-center ml-2 px-4 py-2 w-[120px] rounded-full bg-red-500 text-white font-bold"
                            onClick={handleLogout}
                        >
                            Logout
                        </div>
                    </div>
                    <p className="flex p-2 text-green-500 mt-2 bg-slate-200 justify-center rounded-lg">{session.user.email}</p>
                </>
            ) : (<div><div className='flex flex-row'>
                    <div className='flex justify-center ml-2 px-4 py-2 w-[120px] rounded-full bg-black text-red-500 font-bold' onClick={() => setShowLoginForm(!showLoginForm)}>Login</div>
                    {showLoginForm && (
                        <div ref={formRef} className="absolute mt-2 right-0">
                            <LoginForm onLogin={handleLogin} />
                        </div>
                    )}
                    <div className='flex justify-center ml-2 px-4 py-2 w-[120px] rounded-full bg-white text-green-500 font-bold' onClick={() => setShowRegisterForm(!showRegisterForm)}>Register</div>
                    {showRegisterForm && (
                        <div ref={formRef} className="absolute mt-2 right-0">
                            <RegisterForm onRegister={handleRegister} />
                        </div>
                    )}
                </div> 
                <small className='justify-center'>Login to see your tasks on next visit</small>
            </div>
            )}
            <StatusDisplay />
            {/* {formStatus.success && (
                <div className="text-green-500 mt-2 bg-black">Successfully logged in / registered.</div>
            )}
            {formStatus.error && (
                <div className="text-red-500 mt-2 bg-black">Error: {formStatus.error}</div>
            )} */}
        </div>
    )
}

export default AuthButtons