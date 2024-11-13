import React, { useState, useEffect } from "react";
import "./Entry.css";
import axios from "axios";


function NewEntry(props) {
    const [entry, setEntry] = useState({
        rose: "",
        bud: "",
        thorn: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [existingEntry, setExistingEntry] = useState(null);
   
    useEffect(() => {
        // fetch today's entry when the component mounts
        async function fetchTodayEntry() {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                setErrorMessage("User not logged in");
                return;
            }

            try {
                const response = await axios.get(`/users/${userId}/entries`);
                const entries = response.data;
                const today = new Date().toISOString().split("T")[0];
                const todayEntry = entries.find((entry) => entry.date === today);

                if (todayEntry) {
                    setExistingEntry(todayEntry); 
                }
            } catch (error) {
                console.error("Error fetching today's entry:", error);
                setErrorMessage("Failed to load today's entry");
            }
        }

        fetchTodayEntry();
    }, []);


    function handleChange(event) {
        const { name, value } = event.target;
        setEntry((prevEntry) => ({
            ...prevEntry,
            [name]: value
        }));
        if (errorMessage) setErrorMessage("");
    }

    function submitEntry() {
        if (entry.rose && entry.bud && entry.thorn) {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                setErrorMessage("User not logged in");
                return;
            }

            const newEntry = {
                rose_text: entry.rose,
                bud_text: entry.bud,
                thorn_text: entry.thorn,
                user_id: userId,
                is_public: true
            };

            props.handleSubmit(newEntry);
            setEntry({ rose: "", bud: "", thorn: "" });
        } else {
            setErrorMessage("Please fill in all fields");
        }
    }

    return (
        <div>
            {existingEntry ? (
                <div>
                    <p>You have already created an entry today:</p>
                    <p><strong>Rose:</strong> {existingEntry.rose_text}</p>
                    <p><strong>Bud:</strong> {existingEntry.bud_text}</p>
                    <p><strong>Thorn:</strong> {existingEntry.thorn_text}</p>
                </div>
            ) : (    
                <form>
                    <label htmlFor="rose">Rose</label>
                    <input
                        type="text"
                        name="rose"
                        id="rose"
                        placeholder="What went well today?"
                        value={entry.rose}
                        onChange={handleChange}
                    />
                    <label htmlFor="bud">Bud</label>
                    <input
                        type="text"
                        name="bud"
                        id="bud"
                        placeholder="Any areas for growth?"
                        value={entry.bud}
                        onChange={handleChange}
                    />
                    <label htmlFor="thorn">Thorn</label>
                    <input
                        type="text"
                        name="thorn"
                        id="thorn"
                        placeholder="What could have been better?"
                        value={entry.thorn}
                    onChange={handleChange}
                    />
                    {errorMessage && (
                        <p className="error-message">{errorMessage}</p>
                    )}
                    <input
                        type="button"
                        value="Submit Entry"
                        onClick={submitEntry}
                    />
                </form>
            )}
        </div>    
    );
}

export default NewEntry;
