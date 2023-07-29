import { UserContext } from '../context/UserProvider.jsx'
import { useContext } from 'react'

export default function WelcomeBar () {
    const { userInfo: {user: { username } } } = useContext(UserContext);
    return (
        <div className="welcomebar-wrapper">
            <div>Welcome, {username} </div>
        </div>
    )

}