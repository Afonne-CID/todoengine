import { useState, createContext, useContext } from 'react';

const StatusContext = createContext();
export const useStatus = () => useContext(StatusContext);

export const StatusProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const clearStatus = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <StatusContext.Provider value={{ error, success, setError, setSuccess, clearStatus }}>
      {children}
    </StatusContext.Provider>
  );
};
