import { useState, useContext } from 'react'
import { IssueContext } from '../context/IssueProvider.jsx'
import Issue from './Issue'

export default function MyIssues () {

    const { issues } = useContext(IssueContext);

    const filteredIssues = issues.filter(issue => issue.author === JSON.parse(localStorage.getItem('user'))._id)

    return (
        <div className="myissues-wrapper">
            {filteredIssues.map(issue => <Issue key={issue._id} {...issue} />)}
        </div>
    )
}