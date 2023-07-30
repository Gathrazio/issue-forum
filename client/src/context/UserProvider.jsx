import { useState, createContext, useEffect } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2'

export const UserContext = createContext();

const userAxios = axios.create();

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})

export default function UserProvider (props) {

    const initState = {
        user: JSON.parse(localStorage.getItem("user")) || {},
        token: localStorage.getItem("token") || ''
    };
    const [userState, setUserState] = useState(initState);
    const [users, setUsers] = useState([]);

    async function signup (credentials) {
        const res = await axios.post('/api/auth/signup', credentials);
        return res;
    }

    async function login (credentials) {
        const res = await axios.post('/api/auth/login', credentials);
        return res;
    }

    function logout () {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUserState({
            user: {},
            token: '',
            issues: []
        })
        Swal.fire({
            icon: "success",
            title: "You have been successfully logged out.",
            confirmButtonText: "OK",
            width: '350px',
            position: 'center'
        })
    }

    function updateUsers (users) {
        setUsers(users)
    }

    function setUser ({user, token}) {
        setUserState(prev => ({
            ...prev,
            user: user,
            token: token
        }))
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
    }

    function retrieveUsers () {
        userAxios.get(`/api/protected/users`)
            .then(res => setUsers(res.data))
            .catch(err => console.log(err))
    }

    useEffect(() => {
        if (localStorage.getItem('user')) {
            retrieveUsers()
        }
        
    }, [userState])


    return (
        <UserContext.Provider
            value={{
                userInfo: userState,
                users,
                signup,
                login,
                logout,
                setUser,
                updateUsers
            }}>
            { props.children }
        </UserContext.Provider>
    )
}