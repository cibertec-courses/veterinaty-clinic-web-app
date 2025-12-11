interface MessageProps {
  type?: 'success' | 'error' | 'info' | '';
  text?: string;
}

const Message = ({ type = '', text = '' }: MessageProps) => {
  if (!type || !text) return null;

  const baseClass = "px-4 py-3 rounded-lg mb-4 font-medium border-l-4 animate-[slideIn_0.3s_ease]";

  const typeClasses = {
    success: "bg-green-50 text-green-800 border-green-500",
    error: "bg-red-50 text-red-800 border-red-500",
    info: "bg-blue-50 text-blue-800 border-blue-500",
  };

  return (
    <div className={`${baseClass} ${typeClasses[type as keyof typeof typeClasses] || ''}`}>
      {text}
    </div>
  );
};

export default Message;
