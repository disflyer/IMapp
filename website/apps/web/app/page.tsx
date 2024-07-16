'use client'
import Chat from 'components/Chat';

function ChatApp() {
  return (
    <>
      <div>用户Jenny White:</div>
      <Chat key="Jenny" channelId="6695618a976d681773f8227e" userId="Jenny White" />
      <div>用户Devon Lane:</div>
      <Chat key="Devon" channelId="6695618a976d681773f8227e" userId="Devon Lane" />
    </>
  );
}

export default ChatApp;