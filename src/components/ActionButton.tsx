export default function ActionButton({ children }) {
  return (
    <div className="px-1 py-1 mr-1 text-xs rounded cursor-pointer text-gay-400 hover:bg-gray-200">
      {children}
    </div>
  );
}
