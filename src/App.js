import './App.css';
import SimpleForm from './components/SimpleForm';
import { createLobby } from './functions/game';

function App() {
  return (
    <SimpleForm
      formName="Create Lobby"
      submitCallback={createLobby}
      inputData={[
        { name: 'Name', type: 'string' },
        { name: 'Password', type: 'string', optional: true }
      ]} />
  );
}

export default App;
