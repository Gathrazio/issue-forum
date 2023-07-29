import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router} from 'react-router-dom';
import UserProvider from './context/UserProvider.jsx'
import IssueProvider from './context/IssueProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(<Router>
        <UserProvider>
            <IssueProvider>
                <App />
            </IssueProvider>
        </UserProvider>
</Router>)