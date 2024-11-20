import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./HomePage.css";
import Modal from "react-modal";

function HomePage() {
    const [date, setDate] = useState(new Date());
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [entryDates, setEntryDates] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const API_BASE_URL = "http://localhost:8000";

    // Fetch entry for selected date
    const fetchEntryForDate = async (selectedDate) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/entries`,
                {
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch entries");
            }

            const entries = await response.json();

            const matchingEntry = entries.find((entry) => {
                const entryDate = new Date(entry.date);
                return (
                    entryDate.toDateString() ===
                    selectedDate.toDateString()
                );
            });

            setSelectedEntry(matchingEntry || null);
        } catch (error) {
            console.error("Error fetching entry:", error);
        }
    };

    // Fetch all entry dates
    const fetchAllEntryDates = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/entries`,
                {
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch entries");
            }

            const entries = await response.json();
            const datesWithEntries = entries.map((entry) =>
                new Date(entry.date).toDateString()
            );
            setEntryDates(datesWithEntries);
        } catch (error) {
            console.error("Error fetching entry dates:", error);
        }
    };

    useEffect(() => {
        fetchEntryForDate(date);
        fetchAllEntryDates();
    }, [date]);

    const handleDateChange = (newDate) => {
        setDate(newDate);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const tileClassName = ({ date, view }) => {
        if (view === "month") {
            const dateStr = date.toDateString();
            if (entryDates.includes(dateStr)) {
                return "entry-date";
            }
        }
        return null;
    };

    return (
        <div className="home-page">
            <h1>Rose Garden</h1>
            <div className="calendar-container">
                <Calendar
                    onChange={handleDateChange}
                    value={date}
                    className="custom-calendar"
                    tileClassName={tileClassName}
                />
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    className="pop-up"
                    overlayClassName="overlay"
                >
                    <h2>{date.toDateString()}</h2>
                    {selectedEntry ? (
                        <div className="entry-display">
                            <div className="entry-item">
                                <h3>Rose</h3>
                                <p>{selectedEntry.rose_text}</p>
                            </div>
                            <div className="entry-item">
                                <h3>Bud</h3>
                                <p>{selectedEntry.bud_text}</p>
                            </div>
                            <div className="entry-item">
                                <h3>Thorn</h3>
                                <p>
                                    {selectedEntry.thorn_text}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="no-entry">
                            No entry for this date
                        </p>
                    )}
                </Modal>
            </div>

            <div className="selected-date">
                <span className="date-label">
                    Selected Date:
                </span>
                <span className="date-value">
                    {date.toDateString()}
                </span>
            </div>
        </div>
    );
}

export default HomePage;
