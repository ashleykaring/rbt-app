import React, {useState} from 'react';

function NewEntry(props) {
    const [entry, setEntry] = useState(
        {
            rose: "",
            bud: "",
            thorn:""
        }
    );

    function handleChange(event) {
        const { name, value } = event.target;

        setEntry(prevEntry => ({
            // keep previous entry content same
            ...prevEntry,
            [name]: value
        }));
    }

    // function handleChange(event) {
    //     const { name, value } = event.target;
        
    //     if (name === "rose") {
    //         setEntry(prevEntry => ({
    //             ...prevEntry,
    //             rose: value
    //         }));
    //     } else if (name === "bud") {
    //         setEntry(prevEntry => ({
    //             ...prevEntry,
    //             bud: value
    //         }));
    //     } else if (name === "thorn") {
    //         setEntry(prevEntry => ({
    //             ...prevEntry,
    //             thorn: value
    //         }));
    //     }
    // }

    function submitEntry() {
        props.handleSubmit(entry);
        setEntry({rose: "", bud: "", thorn: ""});
    }

    return(
        <form>
            <label htmlFor="rose">Rose</label>
            <input
                type="text"
                name="rose"
                id="rose"
                value={entry.rose}
                onChange={handleChange} 
            />
            <label htmlFor="bud">Bud</label>
            <input
                type="text"
                name="bud"
                id="bud"
                value={entry.bud}
                onChange={handleChange} 
            />
            <label htmlFor="thorn">Thorn</label>
            <input
                type="text"
                name="thorn"
                id="thorn"
                value={entry.thorn}
                onChange={handleChange} 
            />
            <input type="button" value="Submit" onClick={submitEntry} />  
        </form>
    );
}

export default NewEntry;
