// eslint-disable-next-line react/prop-types
function Button({ children, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-violet-600 hover:bg-violet-900 text-white font-bold py-2 px-4 rounded"
    >
      {children}
    </button>
  );
}

export default Button;
