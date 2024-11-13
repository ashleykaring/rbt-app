import { useState } from 'react';
import Calendar from 'react-calendar';
import './App.css';
import 'react-calendar/dist/Calendar.css';
 
function HomePage() {
  const [date, setDate] = useState(new Date());
 
  return (
    <div className='app'>
      <h1 className='text-center'>Rose Garden</h1>
      <div className='calendar-container'>
        <Calendar onChange={setDate} value={date} />
      </div>
      <p className='text-center'>
        <span className='bold'>Your entry from</span>{' '}
        {date.toDateString()}
      </p>
    </div>
  );
}
 
export default HomePage;