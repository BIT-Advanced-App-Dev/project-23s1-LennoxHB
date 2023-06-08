import List from './List';
import LobbyItem from './LobbyItem';
import SimpleForm from './SimpleForm';
import { createLobby } from '../functions/game';

export default function LobbyPage() {
    return (
        <>
            <SimpleForm
                formName="Create Lobby"
                submitCallback={createLobby}
                inputData={[
                    { field: 'name', text: 'Name', type: 'string' },
                    { field: 'playerCount', text: 'Max Players', type: 'range', min: 2, max: 6, value: 6 },
                    { field: 'password', text: 'Password (optional)', type: 'string' }
                ]} />
            <List child={LobbyItem} dbRef='lobbies' />
        </>
    )
}