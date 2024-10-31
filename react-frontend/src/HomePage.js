import { useState } from 'react';
import Calendar from 'react-calendar';
import './App.css';
import 'react-calendar/dist/Calendar.css';
import Footer from './Footer.js'
import Header from './Header.js'
 
function HomePage() {
  const [date, setDate] = useState(new Date());
 
  return (
    <div className='app'>
      <Header />
      <h1 className='text-center'>Rose Garden</h1>
      <div className='calendar-container'>
        <Calendar onChange={setDate} value={date} />
      </div>
      <p className='text-center'>
        <span className='bold'>Your entry from</span>{' '}
        {date.toDateString()}
      </p>
      <Footer />
    </div>
  );
}
 
export default HomePage;