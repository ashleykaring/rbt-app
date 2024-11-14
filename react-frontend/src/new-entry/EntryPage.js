import React, { useState, useEffect } from "react";
import NewEntry from "./NewEntry";
import axios from "axios";
import "./Entry.css";

function EntryPage() {
    const [entries, setEntries] = useState([]);
    const [userId, setUserId] = useState("");
    const [todayEntryExists, setTodayEntryExists] = useState(false);


    useEffect(() => {
        const currentUserId = localStorage.getItem("userId");
        if (currentUserId) {
            setUserId(currentUserId);
            fetchUserEntries(currentUserId);
        } else {
            console.error("No user ID found in localStorage");
        }
    }, []);

    const fetchUserEntries = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8000/users/${userId}/entries`);
            
            const fetchedEntries = response.data;
            setEntries(response.data);
            const today = new Date().toISOString().split("T")[0];
    
            // Check if an entry already exists for today
        const hasTodayEntry = fetchedEntries.some((entry) => {
            const entryDate = new Date().toISOString().split("T")[0];
            return entryDate === today; 

        });
            setTodayEntryExists(hasTodayEntry);          
        } catch (error) {
            console.error("Error fetching entries:", error);
        }
    };

    // const togglePrivacy = async (entryId, groupId) => {
    //     try {
    //         const response = await axios.patch(
    //             `http://localhost:8000/groups/${groupId}/entries/${entryId}/toggle-privacy`,
    //             { user_id: userId } // sends user ID for authorization
    //         );
    //         const updatedEntry = response.data.entry;
    //         setEntries((prevEntries) =>
    //             prevEntries.map((entry) =>
    //                 entry._id === entryId ? { ...entry, is_public: updatedEntry.is_public } : entry
    //             )
    //         );
    //     } catch (error) {
    //         console.error("Error toggling privacy status:", error);
    //     }
    // };
    const togglePrivacy = async (entryId) => {
        try {
            const response = await axios.patch(
                `http://localhost:8000/entries/${entryId}/toggle-privacy`,
                { user_id: userId } // Sends user ID for authorization
            );
            const updatedEntry = response.data.entry;
    
            // Update the entry in state with its new privacy status
            setEntries((prevEntries) =>
                prevEntries.map((entry) =>
                    entry._id === entryId ? { ...entry, is_public: updatedEntry.is_public } : entry
                )
            );
        } catch (error) {
            console.error("Error toggling privacy status:", error);
        }
    };
      

    async function makePostCall(entry) {
        try {
            const entryWithUser = {
                ...entry,
                user_id: userId
            };

            const response = await axios.post(
                "http://localhost:8000/entries",
                entryWithUser
            );

            if (response.status === 201) {
                await fetchUserEntries(userId);
            }

            return response;
        } catch (error) {
            console.error("Error creating entry:", error);
            return false;
        }
    }

    async function handleSubmit(entry) {
        try {
            const response = await axios.post("http://localhost:8000/entries", entry);
            
            if (response.status === 201) {
                // Successfully created a new entry
                setEntries([response.data, ...entries]);
                setTodayEntryExists(true); // Hide form or show message that entry exists
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                // Entry already exists for today
                setTodayEntryExists(true); // Update state to hide form or show message
                console.log(error.response.data.message); // "You already started an entry today"
            } else {
                console.error("Error creating entry:", error);
            }
        }
    }    

    // return (
    //     <div className="entry-page">
    //         <h1 className="entry-header">New Journal Entry</h1>
            
    //         {!todayEntryExists? (
    //             <NewEntry handleSubmit={handleSubmit} />
    //         ) : (
    //             <div className="existing-entry-message">
    //                  <p>You have already created an entry for today.</p>
    //             </div>
    //         )}

    //         {entries.length > 0 && (
    //             <div className="recent-entry">
    //                 <h2>Most Recent Entry</h2>
    //                 {entries.map((entry) => (
    //                     <div key={entry._id} className="entry-card">
    //                     <div className="entry-item">
    //                         <h3>Rose</h3>
    //                         <p>{entry.rose_text}</p>
    //                     </div>
    //                     <div className="entry-item">
    //                         <h3>Bud</h3>
    //                         <p>{entry.bud_text}</p>
    //                     </div>
    //                     <div className="entry-item">
    //                         <h3>Thorn</h3>
    //                         <p>{entry.thorn_text}</p>
    //                     </div>
    //                     <button onClick={()=> togglePrivacy(entry._id, entry.group_id)}>
    //                         {entry.is_public ? "Make Private" : "Make Public"}
    //                     </button>
    //                 </div>
    //               ))}
    //             </div>
    //         )}
    //     </div>
    // );



    return (
        <div className="entry-page">
            {/* Conditionally render the "New Journal Entry" header and form */}
            {!todayEntryExists ? (
                <>
                    <h1 className="entry-header">New Journal Entry</h1>
                    <NewEntry handleSubmit={handleSubmit} />
                </>
            ) : (
                <div className="existing-entry-message">
                    <p>You have already created an entry for today.</p>
                </div>
            )}
    
            {/* Recent entries section remains visible */}
            {entries.length > 0 && (
                <div className="recent-entry">
                    <h2>Most Recent Entry</h2>
                    {entries.map((entry) => (
                        <div key={entry._id} className="entry-card">
                            <div className="entry-item">
                                <h3>Rose</h3>
                                <p>{entry.rose_text}</p>
                            </div>
                            <div className="entry-item">
                                <h3>Bud</h3>
                                <p>{entry.bud_text}</p>
                            </div>
                            <div className="entry-item">
                                <h3>Thorn</h3>
                                <p>{entry.thorn_text}</p>
                            </div>
                            <button onClick={() => togglePrivacy(entry._id, entry.group_id)}>
                                {entry.is_public ? "Make Private" : "Make Public"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
    
}

export default EntryPage;
