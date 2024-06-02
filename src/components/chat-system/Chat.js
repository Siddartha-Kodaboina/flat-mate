import React, { useEffect, useState, useRef, useMemo } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebaseConfig';

const Chat = ({ conversationId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async (participants) => {
      const usersData = { ...users };
      const userPromises = participants.map(async (uid) => {
        if (!usersData[uid]) {
          const userDoc = await getDoc(doc(db, 'users', uid));
          if (userDoc.exists()) {
            usersData[uid] = userDoc.data().displayName;
          }
        }
      });
      await Promise.all(userPromises);
      setUsers(usersData);
    };

    const fetchConversation = async () => {
      const conversationDoc = await getDoc(doc(db, 'conversations', conversationId));
      if (conversationDoc.exists()) {
        const participants = conversationDoc.data().participants;
        await fetchUsers(participants);
      }
    };

    fetchConversation();
  }, [conversationId]);

  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('timestamp')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()  // Convert Firestore timestamp to JavaScript Date
      }));
      setMessages(messagesData);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      const newMessageData = {
        conversationId,
        senderId: auth.currentUser.uid,
        message: newMessage,
        timestamp: new Date()
      };

      await addDoc(collection(db, 'messages'), newMessageData);

      // Update the latest message in the conversation
      await updateDoc(doc(db, 'conversations', conversationId), {
        latestMessage: newMessageData
      });

      setNewMessage('');
      scrollToBottom();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatDate = (date) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const memoizedUsers = useMemo(() => users, [users]);

  return (
    <div className="flex-1 p-4 flex flex-col bg-sky-100 h-full">
      <div className="flex-1 overflow-y-scroll border border-gray-300 rounded-md p-4 mb-4 flex flex-col-reverse">
        {messages.slice().reverse().map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 p-2 rounded-md ${msg.senderId === auth.currentUser.uid ? 'bg-blue-200 self-end text-right' : 'bg-gray-200 self-start text-left'}`}
          >
            <strong>{memoizedUsers[msg.senderId] || 'Loading...'}</strong>: {msg.message}
            <div className="text-xs text-gray-500">{formatDate(msg.timestamp)}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex-shrink-0 p-4">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-l-md"
            onKeyDown={handleKeyDown}
          />
          <button 
            onClick={handleSendMessage}
            className="p-2 bg-blue-500 text-white rounded-r-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
