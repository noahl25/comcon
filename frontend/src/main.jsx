import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'

import Feed from './components/Feed.jsx'
import Explore from './components/Explore.jsx'
import NotFound from './components/NotFound.jsx'
import Home from './components/Home.jsx'

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	</BrowserRouter>
)
