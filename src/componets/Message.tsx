interface MesageProps{
    type: 'success' | 'error' | 'info';
    text: string;
}

const Message = ({ type, text }: MesageProps) => {
    if (!type || !text) return null;

    return (
        <div className={`message message-${type}`}>
            {text}
        </div>
    );
}

export default Message;