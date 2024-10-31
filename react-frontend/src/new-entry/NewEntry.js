import React, {useState} from "react";
import './Entry.css';

function NewEntry(props) {
    const [entry, setEntry] = useState(
        {
            rose: "",
            bud: "",
            thorn:""
        }
    );
    const [errorMessage, setErrorMessage] = useState("");

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

    function submitEntry() {
        if (entry.rose && entry.bud && entry.thorn) {
            props.handleSubmit(entry);
            setEntry({rose: "", bud: "", thorn: ""});
        } else {
            setErrorMessage("Please fill in all fields")
        }
    }

    return(
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
    );
}

export default NewEntry;
