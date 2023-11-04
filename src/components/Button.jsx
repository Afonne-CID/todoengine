
const Button = ({ title, onClick, buttonColor, buttonOutline }) => (
    <div
        className={`rounded mt-4 px-2 w-auto h-[35px] font-bold flex justify-center items-center ${
        buttonColor ? buttonColor : 'bg-black'
    }`}
  >
        <button className={`text-center justify-center text-white font-poppins font-light`} onClick={onClick}>{title}</button>
    </div>
)

export default Button