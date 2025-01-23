/*
IMPORTS
*/
import { useState, useEffect, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import Calendar from "react-calendar";
import Modal from "react-modal";

// Styles
import "react-calendar/dist/Calendar.css";
import "./HomePage.css";

function HomePage() {
    const [date, setDate] = useState(new Date());
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [recentEntry, setRecentEntry] = useState(null);
    const [entryDates, setEntryDates] = useState([]);
    const [streakCount, setStreakCount] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [activeStartDate, setActiveStartDate] = useState(
        new Date()
    );

    const API_BASE_URL = "http://localhost:8000";

    // fetch most recent entry
    const fetchMostRecentEntry = useCallback(async () => {
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

            // sort entries from newest to oldest
            const sortedEntries = entries.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );

            setRecentEntry(sortedEntries[0] || null);
        } catch (error) {
            console.error(
                "Error fetching most recent entry:",
                error
            );
        }
    }, []);

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
    const fetchAllEntryDates = useCallback(async () => {
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

            // entry dates
            setEntryDates(datesWithEntries);
            // streak count
            calculateStreakCount(datesWithEntries);
        } catch (error) {
            console.error("Error fetching entry dates:", error);
        }
    }, []);

    // streak tracking
    const calculateStreakCount = (dates) => {
        const sortedDates = [...dates]
            .map((date) => new Date(date))
            .sort((a, b) => b - a);

        let streak = 0;
        for (let i = 0; i < sortedDates.length; i++) {
            const current = sortedDates[i];
            const next = new Date(sortedDates[i + 1]);
            if (
                i === 0 ||
                (current - next) / (1000 * 60 * 60 * 24) === 1
            ) {
                streak++;
            } else {
                break;
            }
        }
        setStreakCount(streak);
    };

    useEffect(() => {
        fetchMostRecentEntry();
        fetchAllEntryDates();
    }, [fetchMostRecentEntry, fetchAllEntryDates]);

    useEffect(() => {
        fetchEntryForDate(date);
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

    // check if entry for today
    const hasEntryForToday = entryDates.includes(
        new Date().toDateString()
    );

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
        onSwipedRight: () => handleSwipe("right")
    });

    return (
        <div className="home-page" {...swipeHandlers}>
            <h1 className="home-header">Rose Garden</h1>
            <div className="calendar-container">
                <Calendar
                    onChange={handleDateChange}
                    value={date}
                    className="custom-calendar"
                    tileClassName={tileClassName}
                    activeStartDate={activeStartDate}
                    onActiveStartDateChange={({
                        activeStartDate
                    }) => setActiveStartDate(activeStartDate)}
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

            {!hasEntryForToday && (
                <div className="no-entry-message">
                    <h3>
                        Don't forget to post an entry for today!
                    </h3>
                </div>
            )}

            <div className="selected-date">
                <span className="date-label">
                    Selected Date:
                </span>
                <span className="date-value">
                    {date.toDateString()}
                </span>
            </div>

            {recentEntry && (
                <div className="entry-display">
                    <h2 className="recent-header">
                        Most Recent Entry
                    </h2>
                    <div className="entry-item">
                        <h3>Rose</h3>
                        <p>{recentEntry.rose_text}</p>
                    </div>
                    <div className="entry-item">
                        <h3>Bud</h3>
                        <p>{recentEntry.bud_text}</p>
                    </div>
                    <div className="entry-item">
                        <h3>Thorn</h3>
                        <p>{recentEntry.thorn_text}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;
