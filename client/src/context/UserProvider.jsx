import { useState, createContext, useEffect } from 'react'
import axios from 'axios';

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
        token: localStorage.getItem("token") || '',
        issues: []
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
        loadUserIssues()
    }

    function retrieveUsers () {
        userAxios.get(`/api/protected/users`)
            .then(res => setUsers(res.data))
            .catch(err => console.log(err))
    }

    console.log(users)

    async function postIssue (newIssue) {
        const res = await userAxios.post('/api/protected/issues', newIssue);
        return res;
    }

    function addIssue (postedIssue) {
        setUserState(prev => ({
            ...prev,
            issues: [...prev.issues, postedIssue]
        }))
    }

    function loadUserIssues () {
        userAxios.get('/api/protected/issues/user')
            .then(res => {
                setUserState(prevState => ({
                    ...prevState,
                    issues: res.data
                }))
            })
            .catch(err => console.log(err))
    }

    function updateIssue (issue) {
        if (issue.author === JSON.parse(localStorage.getItem("user"))._id) {
            const issueIndex = userState.issues.findIndex(thisIssue => thisIssue._id === issue._id);
            setUserState(prev => ({
                ...prev,
                issues: prev.issues.toSpliced(issueIndex, 1, issue)
            }))
        }
        
    }

    useEffect(() => {
        if (localStorage.getItem("token")) {
            loadUserIssues()
            retrieveUsers()
        }
    }, [])


    return (
        <UserContext.Provider
            value={{
                userInfo: userState,
                users,
                signup,
                login,
                logout,
                setUser,
                postIssue,
                addIssue,
                updateIssue,
                updateUsers
            }}>
            { props.children }
        </UserContext.Provider>
    )
}