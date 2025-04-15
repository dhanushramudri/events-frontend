import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Events from "./Events";
import EventDetails from './EventDetails';
import Favorites from "../admin/pages/Favorites";
import UserMainLayout from "./UserMainLayout";

function AppUser () {
  return (
      <Routes>
        
        <Route path="/" element={<UserMainLayout  />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="*" element={<Navigate to="/events" replace />} />
      </Routes>
  );
}

export default AppUser ;