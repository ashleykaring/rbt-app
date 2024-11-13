import React, {useState, useEffect} from "react";

function NewEntry(props) {
    const [entry, setEntry] = useState(
        {
            rose: "",
            bud: "",
            thorn:""
        }
    );
    const [errorMessage, setErrorMessage] = useState("");
    const [existingEntry, setExistingEntry] = useState(null); //added

    useEffect(() => {
        // fetch todays entry when component mounts
        async function fetchTodayEntry() {
            try {
                const response = await axios.get(`/users/${props.userId}/entries`);
                const data = await response.json(); 
                const today = new Date().toISOString().split("T")[0];
                const todayEntry = data.find(entry => entry.date === today)

                if (todayEntry) {
                    setExistingEntry(todayEntry); // Set today's entry if it exists
                }
            } catch (error) {
                console.error("Error fetching today's entry", error);
            }
        }
        fetchTodayEntry();
    }, [props.userId]); 

    function handleChange(event) {
        const { name, value } = event.target;

        setEntry(prevEntry => ({
            // keep previous entry content same
            ...prevEntry,
            [name]: value
        }));

        if (errorMessage) {
            setErrorMessage("");
        }
    }

    async function submitEntry() {
        if (entry.rose && entry.bud && entry.thorn) {
            try {
                if (!existingEntry) {
                    const response = await fetch("/entries", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            ...entry,
                            user_id: props.userId,
                            is_public: false // Default privacy setting
                        })
                    });
                    const data = await response.json();

                    if (response.ok) {
                        setEntry({ rose: "", bud: "", thorn: "" });
                        setExistingEntry(data); // Mark as created for today
                   } else {
                       setErrorMessage("Error creating entry");
                   }
                } else {
                    setErrorMessage("You have already created an entry today.");
                }
            } catch (error){
               console.error("Error created", error);
               setErrorMessage("Failed to submit entry");
            }
        } else {
            setErrorMessage("Please fill in all fields");
        }
    }

    return(
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
            <p>{errorMessage}</p>
            <input type="button" value="Submit Entry" onClick={submitEntry} />  
        </form>
        )}
    </div>
    );
}

export default NewEntry;
