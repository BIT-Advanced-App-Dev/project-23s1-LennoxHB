import { login, register } from '../functions/auth';
import SimpleForm from './SimpleForm';

export default function SiteAccess() {
    return (
        <>
            <h1>POKER GAME</h1>
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
        </>
    )
}