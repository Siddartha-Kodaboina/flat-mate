import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebaseConfig';

const UserSearch = ({ onSelectUser }) => {
  const [queryText, setQueryText] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (queryText.trim()) {
        const startText = queryText.trim().toLowerCase();
        const endText = startText + '\uf8ff';

        // Fetch conversations involving the current user
        const conversationsQuery = query(
          collection(db, 'conversations'),
          where('participants', 'array-contains', auth.currentUser.uid)
        );

        const conversationsSnapshot = await getDocs(conversationsQuery);
        const userIds = new Set();

        conversationsSnapshot.docs.forEach(doc => {
          const { participants } = doc.data();
          participants.forEach(uid => {
            if (uid !== auth.currentUser.uid) {
              userIds.add(uid);
            }
          });
        });

        // Fetch user details for the filtered user IDs
        const usersData = [];
        const usersSet = new Set(); // To ensure no duplicate users are added
        for (let uid of userIds) {
          const userDoc = await getDoc(doc(db, 'users', uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (
              userData.displayNameLowerCase >= startText &&
              userData.displayNameLowerCase <= endText
            ) {
              if (!usersSet.has(userDoc.id)) { // Check for duplicates
                usersData.push({
                  id: userDoc.id,
                  ...userData
                });
                usersSet.add(userDoc.id);
              }
            }
          }
        }

        setUsers(usersData);
      } else {
        setUsers([]);
      }
    };

    fetchUsers();
  }, [queryText]);

  return (
    <div className="relative p-4 bg-sky-100">
      <input
        type="text"
        value={queryText}
        onChange={(e) => setQueryText(e.target.value)}
        placeholder="Search users..."
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      {queryText.trim() && users.length > 0 && (
        <ul className="absolute w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          {users.map(user => (
            <li 
              key={user.id} 
              onClick={() => {
                onSelectUser(user);
                setQueryText('');
              }}
              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-4"
            >
              <img src={user.photoURL || 'default-profile.png'} alt={user.displayName} className="w-10 h-10 rounded-full object-cover" />
              <div>{user.displayName}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearch;
