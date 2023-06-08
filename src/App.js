import {  useGetUser } from './functions/auth';
import SiteAccess from './components/siteAccess';
import LobbyPage from './components/LobbyPage';
import Profile from './components/Profile';

export default function App() {
  const user = useGetUser()

  return (
    <>
      {user?.displayName ?
        <>
          <Profile name={user?.displayName} />
          <LobbyPage />
        </>
        :
        <>
          <SiteAccess />
        </>}
    </>
  );
}
