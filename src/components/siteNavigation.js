import {
    Routes,
    Route,
    Link
} from 'react-router-dom';

export default function SiteNavigation() {
    return (
        <>
            <Link to="/items"><button >My Items</button></Link>
            <Link to="/friends"><button >Friends</button></Link>
            <Profile />
            <Routes>
                <Route path="/" element={} />
                <Route path="/items" element={<ItemList />} />
                <Route path="/friends" element={<FriendsMain />} />
                <Route path="/friends/:id" element={<ViewFriend />} />
            </Routes>
        </>
    )
}