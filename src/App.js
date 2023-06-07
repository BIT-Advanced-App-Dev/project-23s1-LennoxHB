import SimpleForm from './components/SimpleForm';
import { createLobby } from './functions/game';
import { login, register, logout, useGetUser } from './functions/auth';
import List from './components/List';
import LobbyItem from './components/LobbyItem';

function App() {
  const user = useGetUser()

  return (
    <>
      {user?.displayName ?
        <>
          <SimpleForm
            key='1'
            formName="Create Lobby"
            submitCallback={createLobby}
            inputData={[
              { field: 'name', text: 'Name', type: 'string' },
              { field: 'playerCount', text: 'Max Players', type: 'range', min: 2, max: 6, value: 6},
              { field: 'password', text: 'Password (optional)', type: 'string' }
            ]} />
          <button onClick={() => logout()}>Sign Out</button>
          <List child={LobbyItem} dbRef='lobbies' />
        </>
        :
        <>
          <SimpleForm
            key='2'
            formName="Login"
            submitCallback={login}
            inputData={[
              { field: 'email', text: 'Email', type: 'string' },
              { field: 'password', text: 'Password', type: 'password' }
            ]} />
          <SimpleForm
            key='3'
            formName="Register"
            submitCallback={register}
            inputData={[
              { field: 'displayName', text: 'Display Name', type: 'string' },
              { field: 'email', text: 'Email', type: 'string' },
              { field: 'password', text: 'Password', type: 'password' }
            ]} />
        </>}
    </>
  );
}

export default App;
