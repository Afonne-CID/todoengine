
const Modal = ({ closeModal, showModal, children }) => {
    if(!showModal) {
        return null
    }

    return (
      <div className="flex items-center fixed top-0 left-0 w-full h-full z-50 overflow-auto bg-opacity-50 bg-black">
        <div className="relative mx-4 sm:mx-auto w-full sm:w-auto max-w-2xl bg-gradient-to-br from-[#44D9F9] via-pink-400 to-red-400 rounded-md shadow-lg">
          <div className="p-4 overflow-auto h-auto max-h-[70vh] md:max-h-[80vh] lg:max-h-[85vh] z-60">
            {children}
          </div>
          <button
            className="absolute top-2 right-2 text-gray-700 hover:text-red-500 z-60"
            onClick={closeModal}
          >
            &times;
          </button>
        </div>
      </div>
    );

};

export default Modal;