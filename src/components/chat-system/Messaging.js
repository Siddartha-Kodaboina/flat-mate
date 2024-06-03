import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Chat from './Chat';

const Messaging = () => {
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const conversationId = params.get('conversationId');
    if (conversationId) {
      setSelectedConversationId(conversationId);
    } else {
      setSelectedConversationId(null);
    }
  }, [location]);

  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
    navigate(`/messaging?conversationId=${conversationId}`);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[90vh]">
      {selectedConversationId ? (
        <>
          <div className="lg:w-2/5 w-full h-full hidden lg:flex border-r border-gray-300">
            <Sidebar onSelectConversation={handleSelectConversation} selectedConversationId={selectedConversationId} />
          </div>
          <div className="lg:w-3/5 w-full h-full flex">
            <Chat conversationId={selectedConversationId} />
          </div>
        </>
      ) : (
        <div className="flex w-full h-full">
          <div className="lg:w-2/5 w-full h-full border-r border-gray-300">
            <Sidebar onSelectConversation={handleSelectConversation} selectedConversationId={selectedConversationId} />
          </div>
          <div className="hidden lg:flex items-center justify-center w-full">
            <div className="text-center text-gray-500">
              <h1 className="text-2xl">Start texting and find your home</h1>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messaging;
