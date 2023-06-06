import SimpleForm from './components/SimpleForm';
import { createLobby } from './functions/game';
import { login, register, logout, useGetUser } from './functions/auth';

function App() {
  const user = useGetUser()

  return (
    <>
      {user?.displayName ?
        <>
          <SimpleForm
            formName="Create Lobby"
            submitCallback={createLobby}
            inputData={[
              { field: 'name', text: 'Name', type: 'string' },
              { field: 'password', text: 'Password (optional)', type: 'string' }
            ]} />
          <button onClick={() => logout()}>Sign Out</button>
        </>
        :
        <>
          <SimpleForm
            formName="Login"
            submitCallback={login}
            inputData={[
              { field: 'email', text: 'Email', type: 'string' },
              { field: 'password', text: 'Password', type: 'password' }
            ]} />
          <SimpleForm
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
