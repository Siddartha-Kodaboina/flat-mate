import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, addDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebaseConfig';
import UserSearch from './UserSearch';

const Sidebar = ({ onSelectConversation, selectedConversationId }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [userPhotos, setUserPhotos] = useState({});
  const [unseenMessages, setUnseenMessages] = useState({});

  useEffect(() => {
    const fetchUserNamesAndPhotos = async (uids) => {
      const userData = {};
      const userPhotosData = {};
      for (let uid of uids) {
        if (!userNames[uid] || !userPhotos[uid]) {
          const userDoc = await getDoc(doc(db, 'users', uid));
          if (userDoc.exists()) {
            userData[uid] = userDoc.data().displayName;
            userPhotosData[uid] = userDoc.data().photoURL || 'default-profile.png';
          }
        }
      }
      setUserNames((prevNames) => ({ ...prevNames, ...userData }));
      setUserPhotos((prevPhotos) => ({ ...prevPhotos, ...userPhotosData }));
    };

    const fetchConversations = async () => {
      const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', auth.currentUser.uid),
        orderBy('latestMessage.timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const conversationsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const uids = [];
      conversationsData.forEach(convo => {
        convo.participants.forEach(uid => {
          if (!uids.includes(uid) && uid !== auth.currentUser.uid) {
            uids.push(uid);
          }
        });
      });

      await fetchUserNamesAndPhotos(uids);
      setConversations(conversationsData);

      // Fetch unseen messages count for each conversation
      const unseenMessagesData = {};
      for (const conversation of conversationsData) {
        const lastSeenMessageId = conversation.lastSeenMessages[auth.currentUser.uid];
        if (lastSeenMessageId) {
          const lastSeenMessageDoc = await getDoc(doc(db, 'messages', lastSeenMessageId));
          if (lastSeenMessageDoc.exists()) {
            const lastSeenMessageTimestamp = lastSeenMessageDoc.data().timestamp;

            const messagesQuery = query(
              collection(db, 'messages'),
              where('conversationId', '==', conversation.id),
              where('timestamp', '>', lastSeenMessageTimestamp),
              orderBy('timestamp')
            );

            const messagesSnapshot = await getDocs(messagesQuery);
            const unseenCount = messagesSnapshot.size;
            unseenMessagesData[conversation.id] = unseenCount;
          } else {
            unseenMessagesData[conversation.id] = 0;
          }
        } else {
          unseenMessagesData[conversation.id] = 0;
        }
      }
      setUnseenMessages(unseenMessagesData);
    };

    fetchConversations();
  }, [userNames, userPhotos]);

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    const q = query(collection(db, 'conversations'), where('participants', 'array-contains', auth.currentUser.uid));
    const querySnapshot = await getDocs(q);

    let conversation;
    for (let doc of querySnapshot.docs) {
      const data = doc.data();
      if (data.participants.includes(user.uid)) {
        conversation = { id: doc.id, ...data };
        break;
      }
    }

    if (!conversation) {
      const newConversation = {
        participants: [auth.currentUser.uid, user.uid],
        latestMessage: {
          message: '',
          senderId: '',
          timestamp: null
        },
        lastSeenMessages: {
          [auth.currentUser.uid]: null,
          [user.uid]: null
        }
      };
      const docRef = await addDoc(collection(db, 'conversations'), newConversation);
      conversation = { id: docRef.id, ...newConversation };
    }
    onSelectConversation(conversation.id);
  };

  const truncateMessage = (message, length) => {
    return message.length > length ? message.substring(0, length) + '...' : message;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'No messages yet';
    let date;
    if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  return (
    <div className="p-4 bg-sky-100 h-full overflow-y-auto flex flex-col lg:flex-1">
      <UserSearch onSelectUser={handleSelectUser} />
      <ul className="mt-4 space-y-2">
        {conversations.map(conversation => {
          const otherUser = conversation.participants.find(uid => uid !== auth.currentUser.uid);
          const otherUserName = userNames[otherUser];
          const otherUserPhoto = userPhotos[otherUser];
          const lastMessage = truncateMessage(conversation.latestMessage.message, 64);
          const lastMessageSender = conversation.latestMessage.senderId === auth.currentUser.uid ? 'You' : otherUserName;
          const timestamp = conversation.latestMessage.timestamp ? conversation.latestMessage.timestamp : null;
          const unseenCount = unseenMessages[conversation.id] || 0;

          return (
            <li 
              key={conversation.id} 
              onClick={() => onSelectConversation(conversation.id)}
              className={`p-2 border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer flex items-center space-x-4 ${conversation.id === selectedConversationId ? 'bg-blue-200' : ''}`}
            >
              <img src={otherUserPhoto} alt={otherUserName} className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex justify-between">
                    <div className="font-bold">{otherUserName}</div>
                    <div className="text-xs text-gray-400">{timestamp ? formatDate(timestamp) : ''}</div>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  {lastMessageSender}: {lastMessage}
                  {unseenCount > 0 && (
                    <span className="ml-2 bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                      <p>{unseenCount}</p>
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
