import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Home from './features/home/home';
import Search from './features/search/search';
import Navbar from './layouts/navbar/navbar';
import NotificationContainer from './components/notification/notification';

import './App.scss';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <NotificationContainer />
      </BrowserRouter>
    </div>
  );
}

export default App;
