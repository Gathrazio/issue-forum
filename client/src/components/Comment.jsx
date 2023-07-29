import { useState, useContext, useEffect } from 'react'
import { UserContext } from '../context/UserProvider.jsx'
import renderDate from '../dateRenderer.js'


export default function Comment (props) {

    const { users } = useContext(UserContext);

    const [commentAuthor, setCommentAuthor] = useState('');

    useEffect(() => {
        const author = users.find(user => user._id === props.author);
        setCommentAuthor(author.username)
    }, [])

    return (
        <div className="comment-wrapper">
            <div className="comment-author-line">
                <p className="date"> <b>@{commentAuthor}</b> &nbsp; &nbsp; &nbsp; | &nbsp; &nbsp; &nbsp; <em>{renderDate(props.createdAt)}</em></p>
            </div>
            <p className="comment-body">{props.body}</p>
        </div>
    )
}