import { IconContext } from 'react-icons'
import { IssueContext } from '../context/IssueProvider'
import { IoIosArrowBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import Issue from './Issue'


export default function AllIssues () {
    const navigate = useNavigate();
    const { issues } = useContext(IssueContext);
    const ratingsArray = issues.map(issue => issue.opinions.reduce((accumulator, currentOpinion) => accumulator + currentOpinion.agree, 0));
    // console.log(ratingsArray)
    const mashedArray = issues.map((issue, index) => [issue, ratingsArray[index]])
    // console.log(mashedArray)
    const sortedMashedArray = mashedArray.sort((a, b) => b[1] - a[1])
    // console.log(sortedMashedArray)
    const sortedIssues = sortedMashedArray.map(tuple => tuple[0])
    // console.log(sortedIssues)
    
    return (
        <div className="allissues-wrapper">
            <div className="welcomebar-wrapper all-issues-wrap">
                <IconContext.Provider value={{ className: 'react-icons-issues' }}>
                    <div onClick={() => navigate('/profile')} className="back-wrapper">
                        <IoIosArrowBack />
                    </div>
                </IconContext.Provider>
                <div className="all-title">
                     View and interact with all issues!
                </div>
            </div>
            <div className="issue-bay">
            {sortedIssues.map(issue => <Issue key={issue._id} {...issue} />)}
            </div>
        </div>
    )
}