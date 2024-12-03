import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import "./HomePage.css";
import Modal from "react-modal";
// add and install!
import { useSwipeable } from "react-swipeable";

function HomePage() {
    const [date, setDate] = useState(new Date());
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [userId, setUserId] = useState(null);
    const [entryDates, setEntryDates] = useState([]);
    // add
    const [streakCount, setStreakCount] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    // add
    const [activeStartDate, setActiveStartDate] = useState(new Date());

    useEffect(() => {
        const user = localStorage.getItem("userId");
        if (user) {
            setUserId(user);
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetchEntryForDate(date, userId);
            fetchAllEntryDates(userId);
        }
    }, [date, userId]);

    const fetchEntryForDate = async (selectedDate, uid) => {
        try {
            const response = await axios.get(
                `http://localhost:8000/users/${uid}/entries`
            );
            const entries = response.data;

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

    const fetchAllEntryDates = async (uid) => {
        try {
            const response = await axios.get(
                `http://localhost:8000/users/${uid}/entries`
            );
            const entries = response.data;

            const datesWithEntries = entries.map((entry) =>
                new Date(entry.date).toDateString()
            );
            setEntryDates(datesWithEntries);

            // streak count add
            calculateStreakCount(datesWithEntries);

        } catch (error) {
            console.error("Error fetching entry dates:", error);
        }
    };

    // add function to do streak count 
    const calculateStreakCount = (dates) => {
        const sortedDates = [...dates]
            .map((date) => new Date(date))
            .sort((a, b) => b - a);
        
        let streak = 0;
        for (let i = 0; i < sortedDates.length; i++) {
            const current = sortedDates[i];
            const next = new Date(sortedDates[i + 1]);
            if (i === 0 || (current - next) / (1000 * 60 * 60 * 24) === 1) {
                streak++;
            } else {
                break;
            }
        }
        setStreakCount(streak);

    };

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

    // add swipe function 
    const handleSwipe = (direction) => {
        const newDate = new Date(activeStartDate);
        if (direction === "left") {
            newDate.setMonth(newDate.getMonth() + 1);
        } else if (direction === "right") {
            newDate.setMonth(newDate.getMonth() - 1);
        }
        setActiveStartDate(newDate);
    };

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => handleSwipe("left"),
        onSwipedRight: () => handleSwipe("right"),
    });

    return (
        <div className="home-page" {...swipeHandlers}>
            <h1>Rose Garden</h1>
            <div className="calendar-container">
                <Calendar
                    onChange={handleDateChange}
                    value={date}
                    className="custom-calendar"
                    tileClassName={tileClassName}
                    activeStartDate={activeStartDate}
                    onActiveStartDateChange={({activeStartDate}) =>
                        setActiveStartDate(activeStartDate)
                    }
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
            <div className="streak-counter">
                <h2>Current Streak: {streakCount} days!</h2>
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