import { ChatPromptSchema, ExecutionRun, PromptRole } from "@composableai/studio";
import { ChangeEvent, useMemo, useState } from "react";
import { StudyLanguageChat, configure } from "./interactions";

configure({
  apikey: "sk-ec54686e78643101d7133b95ea2c43c5"
})

const studyLaguage = new StudyLanguageChat();

export default function App() {
  const [text, setText] = useState<string | undefined>(undefined);
  const [chat, setChat] = useState<ChatPromptSchema[]>([]);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const executeInteraction = useMemo(() => () => {
    if (!message) return;
    setChat([...chat,
    { role: PromptRole.user, content: message }
    ]);
    setMessage('');
    setText('');
    const chunks: string[] = [];
    studyLaguage.execute({
      data: {
        student_name: "Julien",
        user_language: "french",
        study_language: "english",
        interests: ["sports", "music"],
        student_age: 20,
        chat
      }
    },
      (run: ExecutionRun) => {
        setChat([...chat,
        { role: PromptRole.assistant, content: run.result as string }
        ]);
        setText(undefined);
      },
      (chunk: string) => {
        chunks.push(chunk);
        setText(chunks.join(""));
      });
  }, [message, chat]);

  const onTypeMessage = (ev: ChangeEvent<HTMLInputElement>) => {
    setMessage(ev.target.value);
  }

  return (
    <div>
      <div>
        {
          chat.map((msg: ChatPromptSchema, index: number) =>
            <ChatMessage key={index} message={msg} />)
        }
      </div>
      <div>
        {text && <div className='chunks' style={{ whiteSpace: 'pre-wrap' }}>{text}</div>}
      </div>
      <div style={{ marginTop: '16px' }}>
        <input type='text' value={message || ''} onChange={onTypeMessage} />
        <button onClick={executeInteraction}>Send</button>
      </div>
    </div>
  )
}


function ChatMessage({ message }: { message: ChatPromptSchema }) {
  return (
    <div style={{
      whiteSpace: 'pre-wrap',
      borderBottom: '1px solid #dedede',
      margin: '8px 0',
      padding: '16px 0'
    }}>
      <h3>{message.role}</h3>
      <div>{message.content}</div>
    </div>
  )
}
