import { useState } from "react";
import { api } from "trpc/react";

const Chat = ({ channelId, userId }) => {
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)

  const { mutateAsync } = api.post.add.useMutation()
  api.post.onAdd.useSubscription({ channelId }, {
    onData(event) {
      if (messages.length === 0) {
        setLoading(false)
      }
      setMessages(pre => pre.concat([event.data]));
    },
    onStarted() {
      setMessages([])
    }
  },)
  return (
    <div className="bg-gray-900 text-white overflow-hidden mx-auto w-[850px] no-scrollbar">
      <div className="bg-gray-800 p-4 text-lg font-bold">Test Chat</div>
      <div className="p-4 h-96 overflow-y-auto space-y-6 flex flex-col-reverse">
        {loading && <div className="text-gray-500 flex justify-center h-full items-center">loading</div>}
        {messages.map((message) => (
          <div key={message.id} className={`${message.author === userId ? 'flex flex-row-reverse' : 'flex'} space-x-4`}>
            <div className={`flex flex-col ${message.author === userId ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-gray-400">{message.author}</span>
                <span className=" text-gray-500 text-xs">{message.createAt}</span>
              </div>
              <div className={`${message.author === userId ? 'text-black bg-green-300' : 'bg-gray-700'} p-3 rounded-lg max-w-[500px] break-words`}>
                {message.content}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-700 bg-gray-900">
        <textarea onKeyDown={async (e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            await mutateAsync({
              channelId,
              author: userId,
              content
            })
            setContent("")
          }
        }}
          placeholder="input message"
          value={content}
          onChange={(e) => {
            console.log(e.target.value)
            setContent(e.target.value)
          }}
          className="w-full p-3 resize-none bg-gray-800 text-white outline-none" />
      </div>
    </div>
  )
}

export default Chat