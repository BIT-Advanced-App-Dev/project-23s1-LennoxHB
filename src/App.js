import SimpleForm from './components/SimpleForm';
import { createLobby } from './functions/game';
import { login, register, logout, useGetUser } from './functions/auth';

function App() {
  const user = useGetUser()

  return (
    <>
      {user?.uid ?
        <>
          <SimpleForm
            formName="Create Lobby"
            submitCallback={createLobby}
            inputData={[
              { name: 'Name', type: 'string' },
              { name: 'Password', type: 'string', optional: true }
            ]} />
          <button onClick={() => logout()}>Sign Out</button>
        </>
        :
        <>
          <SimpleForm
            formName="Login"
            submitCallback={login}
            inputData={[
              { name: 'Name', type: 'string' },
              { name: 'Password', type: 'string' }
            ]} />
          <SimpleForm
            formName="Register"
            submitCallback={register}
            inputData={[
              { name: 'Display Name', type: 'string' },
              { name: 'Email', type: 'string' },
              { name: 'Password', type: 'string' }
            ]} />
        </>}
    </>
  );
}

export default App;
