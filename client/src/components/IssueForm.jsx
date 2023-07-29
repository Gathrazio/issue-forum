import { useState, useContext } from 'react'
import { UserContext } from '../context/UserProvider.jsx'
import { IssueContext } from '../context/IssueProvider.jsx'
import Swal from 'sweetalert2'

export default function IssueForm () {

    const { postIssue, addIssue } = useContext(UserContext);
    const { addGlobalIssue } = useContext(IssueContext);

    const [inputValues, setInputValues] = useState({
        title: '',
        description: ''
    })

    function handleChange (e) {
        const {name, value} = e.target;
        setInputValues(prev => ({
            ...prev,
            [name]: value
        }))
    }

    function handleSubmit (e) {
        e.preventDefault()
        postIssue(inputValues)
            .then(
                function (res) {
                    addIssue(res.data)
                    addGlobalIssue(res.data)
                    Swal.fire({
                        icon: "success",
                        title: "Issue posted!",
                        confirmButtonText: "OK"
                    })
                    setInputValues({
                        title: '',
                        description: ''
                    })
                },
                function (err) {
                    Swal.fire({
                        icon: "error",
                        title: "Issue failed to post...",
                        confirmButtonText: "OK"
                    })
                    console.dir(err.response.data.errMsg)
                }
            )
    }

    return (
        <form className="issue-form" onSubmit={handleSubmit}>
            <input type="text" className="issue-input" placeholder="Title" value={inputValues.title} name="title" onChange={handleChange} required/>
            <textarea className="issue-input issue-input-description" placeholder="Description" value={inputValues.description} name="description" onChange={handleChange} required/>
            <button className="issue-button">Submit</button>
        </form>
    )
}