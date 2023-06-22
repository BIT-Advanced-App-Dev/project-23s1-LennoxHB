import {
    Routes,
    Route
} from 'react-router-dom';
import MainPage from './MainPage';
import Lobby from './Lobby';
import Game from './Game';

// Does not render anything, contains routes that are used on the app.
export default function Navigation() {
    return (
        <>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path= "/lobby/:id" element={<Lobby />} />
                <Route path= "/game/:id" element={<Game />} />
            </Routes>
        </>
    )
}