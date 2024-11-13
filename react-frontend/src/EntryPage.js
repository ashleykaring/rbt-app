import React, {useState, useEffect} from 'react';
import Table from './Table';
import NewEntry from './NewEntry';
import axios from 'axios';

function EntryPage() { 
  const [rbt, setRbt] = useState([]);
  // for keeping track of user
  const [user, setUser] = useState("");


  // construct object on submit and send to backend with id
  // get id from local storage

  useEffect(() => {
    // get user id from local storage
    const user = localStorage.getItem('userId');
    if (user) {
      setUser(user);
      fetchUserEntries(user); // fetch users entries
      fetchGroupEntries(user); // fetch entries for the user's group
    } else {
      console.log("Error getting user id");
      return false;
    }
  }, []);

 // fetch group entries of user
 async function fetchGroupEntries(userId) {
  try {
    const response = await axios.get(`/groups/user/${userId}/entries`); // Adjust endpoint if necessary
    setRbt(response.data); // users entries
  } catch (error) {
    console.error("Error fetching group entries:", error);
  }
}

  // toggle privacy for a user entry
  async function togglePrivacy(entryId) {
    try {
      const response = await axios.patch(`/groups/${groupId}/entries/${entryId}/toggle-privacy`, {
        user_id: user, // Pass the current user ID for authorization
      });
      const updatedEntry = response.data.entry;
      // update the entrys privacy status in the rbt state
      setRbt(prevEntries =>
        prevEntries.map(entry =>
          entry._id === entryId ? { ...entry, is_public: updatedEntry.is_public } : entry
        )
      );
    } catch (error) {
      console.error("Error toggling privacy status:", error);
    }
  }

  async function makePostCall(entry) {
    try {
      const response = await axios.post('http://localhost:8000/entries', entry);
      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  function updateRbt(entry) {
    // construct entry object
    const addedEntry = {
      user_id: user,
      // date as integer for now
      // may be converted to a string when sent
      date: Date.now(),
      // edit once public feature added
      is_public: false,
      rose_text: entry.rose,
      bud_text: entry.bud,
      thorn_text: entry.thorn,
    };


    console.log({addedEntry});

    makePostCall(addedEntry).then(result => {
        // change success status code based on backend
        // 201 success code for created
        if (result && result.status === 201) {
          setRbt([...rbt, result.data]);
        }
      });
  }

  // function updateRbt(entry) { 
  //   makePostCall(entry).then(result => {
  //   if (result && result.status === 201)
  //      setRbt([...rbt, result.data]);
  //   });
  // }

  // function updateRbt(entry) {
  //   setRbt([...rbt, entry]);
  // }

  return (
    <div className="container">
        <h1>New Journal Entry</h1>
        <Table rbtData={entries} /> {/* Display all entries */}
        <NewEntry userId="user123" onNewEntry={handleNewEntry} /> {/* Render NewEntry component */}
        </div>
  );
}

export default EntryPage;
