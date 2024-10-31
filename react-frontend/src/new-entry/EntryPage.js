import React, {useState, useEffect} from 'react';
import Table from './Table';
import NewEntry from './NewEntry';
import axios from 'axios';
import './Entry.css';
import Footer from '../Footer.js'
import Header from '../Header.js'

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
    } else {
      console.log("Error getting user id");
      return false;
    }
  }, []);

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
        <Header />
        <h1>New Journal Entry</h1>
        <Table rbtData={rbt}/>
        <NewEntry handleSubmit={updateRbt}/>
        <Footer />
    </div>
  );
}

export default EntryPage;
