import Nav from './Nav'
import WelcomeBar from './WelcomeBar'
import NewIssue from './NewIssue'
import MyIssues from './MyIssues'
import { useState } from 'react'

export default function Profile () {

    const [issueToggle, setIssueToggle] = useState(true);

    function updateToggle (updator) {
        if (updator === 0) {
            setIssueToggle(true)
        } else {
            setIssueToggle(false)
        }
    }
    
    return (
        <div className="profile-wrapper">
            <Nav updateToggle={updateToggle}/>
            <WelcomeBar />
            { issueToggle ?
            <NewIssue />
            :
            <MyIssues />
            }
        </div>
    )
}