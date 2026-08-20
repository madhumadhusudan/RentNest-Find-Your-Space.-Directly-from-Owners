/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from 'react-router-dom';
import { Layout } from './Layout.tsx';
import { Home } from './pages/Home.tsx';
import { MapExplorer } from './pages/MapExplorer.tsx';
import { Search } from './pages/Search.tsx';
import { PropertyDetails } from './pages/PropertyDetails.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { AddProperty } from './pages/AddProperty.tsx';
import { Profile } from './pages/Profile.tsx';
import { Login } from './pages/Login.tsx';
import { Register } from './pages/Register.tsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="map" element={<MapExplorer />} />
        <Route path="search" element={<Search />} />
        <Route path="property/:id" element={<PropertyDetails />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="add-property" element={<AddProperty />} />
        <Route path="profile" element={<Profile />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
}
