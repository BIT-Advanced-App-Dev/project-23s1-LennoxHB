import { useGetUser } from './functions/auth';
import SiteAccess from './components/siteAccess';
import Profile from './components/Profile';
import Navigation from './components/Navigation';

export default function App() {
  const user = useGetUser()

  return (
    <>
      {user?.displayName ?
        <>
          <Profile name={user?.displayName} />
          <Navigation />
        </>
        :
        <>
          <SiteAccess />
        </>}
    </>
  );
}
