/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Shell } from './components/layout/Shell';
import Home from './pages/Home';
import Category from './pages/Category';
import Topic from './pages/Topic';
import Profile from './pages/Profile';
import { AuthProvider } from './lib/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Shell>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryId" element={<Category />} />
            <Route path="/category/:categoryId/topic/:topicId" element={<Topic />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/members" element={<div>Članovi...</div>} />
          </Routes>
        </Shell>
      </BrowserRouter>
    </AuthProvider>
  );
}
