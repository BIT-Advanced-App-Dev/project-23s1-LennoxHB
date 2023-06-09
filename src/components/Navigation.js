import {
    Routes,
    Route
} from 'react-router-dom';
import MainPage from './MainPage';
import Lobby from './Lobby';

export default function Navigation() {
    return (
        <>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path= "/lobby/:id" element={<Lobby />} />
            </Routes>
        </>
    )
}