import { UserContext } from '../context/UserProvider.jsx'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'


export default function Nav ({updateToggle}) {

    const { logout } = useContext(UserContext);
    const navigate = useNavigate();

    const [optionSelected, setOptionSelected] = useState({
        newIssue: ' selected',
        myIssues: ''
    });

    function handleLogout () {
        logout()
        navigate('/')
    }

    function handleToggle (toggler) {
        if (toggler === 0) {
            setOptionSelected({
                newIssue: ' selected',
                myIssues: ''
            })
        } else {
            setOptionSelected({
                newIssue: '',
                myIssues: ' selected'
            })
        }
        updateToggle(toggler)
    }

    return (
        <div className="nav-wrapper">
            <button onClick={handleLogout} className="logout-button">Logout</button>
            <div className="options-wrapper">
                <div onClick={() => handleToggle(0)} className={`new-issue issue-option${optionSelected.newIssue}`}>New Issue</div>
                <div onClick={() => handleToggle(1)} className={`my-issues issue-option${optionSelected.myIssues}`}>My Issues</div>
                <div onClick={() => navigate('/issues')} className="all-issues issue-option">All Issues</div>
            </div>
        </div>
    )
}