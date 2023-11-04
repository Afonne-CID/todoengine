import { useStatus } from "../helpers/errorContext";

const StatusDisplay = () => {
  const { error, success, clearStatus } = useStatus();

  if (!error && !success) {
    return null;
  }

  return (
    <div className="mt-2">
      {error && (
        <div className="text-red-500 mt-2 bg-black">
          Error: {error}
          <button onClick={clearStatus}>Clear</button>
        </div>
      )}
      {success && (
        <div className="text-green-500 mt-2 bg-black">
          Success: {success}
          <button onClick={clearStatus}>Clear</button>
        </div>
      )}
    </div>
  );
};

export default StatusDisplay;
