import { useState, useContext } from 'react'
import { UserContext } from '../context/UserProvider.jsx'
import Issue from './Issue'

export default function MyIssues () {

    const { userInfo: { issues }} = useContext(UserContext);

    return (
        <div className="myissues-wrapper">
            {issues.map(issue => <Issue key={issue._id} {...issue} />)}
        </div>
    )
}