import { useState, useContext, useEffect } from 'react'
import { IssueContext } from '../context/IssueProvider.jsx'
import Comment from './Comment'
import renderDate from '../dateRenderer.js'
import axios from 'axios';
import { IconContext } from "react-icons";
import { AiOutlineLike, AiOutlineDislike, AiFillDislike, AiFillLike } from 'react-icons/ai'
import { UserContext } from '../context/UserProvider.jsx'

const userAxios = axios.create();

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})

export default function Issue (props) {

    const { comments, addComment, updateGlobalIssue } = useContext(IssueContext);
    const { users, updateIssue } = useContext(UserContext);

    const relevantComments = comments.filter(comment => comment.issue === props._id)

    
    const [commentsToggle, setCommentsToggle] = useState(false);
    const [addCommentToggle, setAddCommentToggle] = useState(false);
    const [likeToggle, setLikeToggle] = useState(false);
    const [dislikeToggle, setDislikeToggle] = useState(false);
    const [commentInput, setCommentInput] = useState('');
    const [totals, setTotals] = useState([0, 0]);

    function handleChange (e) {
        const { value } = e.target;
        setCommentInput(value)
    }

    function handlePost (e) {
        e.preventDefault()
        userAxios.post(`/api/protected/comments`, {
            body: commentInput,
            issue: props._id
        })
            .then(res => addComment(res.data))
            .catch(err => console.log(err))
        setCommentInput('')
    }

    function updateIssueWithOpinion (agree) {
        const userIndex = props.opinions.findIndex(opinion => opinion.user.toString() === JSON.parse(localStorage.getItem("user"))._id);
            if (userIndex === -1) {
                userAxios.put(`/api/protected/issues/update/likes/${props._id}`, {
                    opinions: [...props.opinions, {
                        user: JSON.parse(localStorage.getItem("user"))._id,
                        agree: agree
                    }]
                })
                    .then(res => {
                        updateIssue(res.data)
                        updateGlobalIssue(res.data)
                    })
                    .catch(err => console.log(err))
            } else {
                userAxios.put(`/api/protected/issues/update/${props._id}`, {
                    opinions: props.opinions.toSpliced(userIndex, 1, {
                        user: JSON.parse(localStorage.getItem("user"))._id,
                        agree: agree
                    })
                })
                    .then(res => {
                        updateIssue(res.data)
                        updateGlobalIssue(res.data)
                    })
                    .catch(err => console.log(err))
            }
    }

    function handleLikeToggle () {
        if (!likeToggle && !dislikeToggle) {
            updateIssueWithOpinion(1)
            setTotals(prev => [prev[0] + 1, prev[1]])
        } else if (likeToggle && !dislikeToggle) {
            updateIssueWithOpinion(0)
            setTotals(prev => [prev[0] - 1, prev[1]])
        } else if (!likeToggle && dislikeToggle) {
            updateIssueWithOpinion(1)
            setTotals(prev => [prev[0] + 1, prev[1] - 1])
        }


        if (dislikeToggle) {
            setDislikeToggle(prev => !prev)
        }
        setLikeToggle(prev => !prev)

    }

    function handleDislikeToggle () {
        if (!dislikeToggle && !likeToggle) {
            updateIssueWithOpinion(-1)
            setTotals(prev => [prev[0], prev[1] + 1])
        } else if (dislikeToggle && !likeToggle){
            updateIssueWithOpinion(0)
            setTotals(prev => [prev[0], prev[1] - 1])
        } else if (!dislikeToggle && likeToggle) {
            updateIssueWithOpinion(-1)
            setTotals(prev => [prev[0] - 1, prev[1] + 1])
        }

        if (likeToggle) {
            setLikeToggle(prev => !prev)
        }
        setDislikeToggle(prev => !prev)
    }

    useEffect(() => {
        let likes = 0;
        let dislikes = 0;
        props.opinions.forEach(opinion => {
            if (opinion.agree === -1) {
                dislikes += 1;
            } else if (opinion.agree === 1) {
                likes += 1;
            }
        })
        setTotals([likes, dislikes])
        const userIndex = props.opinions.findIndex(opinion => opinion.user.toString() === JSON.parse(localStorage.getItem("user"))._id);
        if (userIndex != -1) {
            switch (props.opinions[userIndex].agree) {
                case -1:
                    setDislikeToggle(true)
                    break;
                case 1:
                    setLikeToggle(true)
                    break;
            }
        }
    }, [])

    return (
        <div className="issue-wrapper">  
            <div className="issue-title-line">
                <p className="date"><b>@{users.length != 0 && users.find(user => user._id.toString() === props.author).username}</b> &nbsp; &nbsp; &nbsp; | &nbsp; &nbsp; &nbsp; <em>{renderDate(props.createdAt)}</em></p>
                <h3 className="issue-title">{props.title}</h3>
            </div>
            <p className="issue-description">{props.description}</p>
            <form onSubmit={handlePost}>
                <div className="comment-button-likes-wrapper">
                <div className="comment-button-wrapper">
                { relevantComments.length != 0 && 
            <button type="button" className="comment-toggle-button" onClick={() => setCommentsToggle(prev => !prev)}>{commentsToggle ? "Hide" : "Show"} Comment{relevantComments.length === 1 ? '' : 's'}</button>
            } 
            <button type="button" onClick={() => setAddCommentToggle(prev => !prev)} className="comment-toggle-button comment-add-button">{addCommentToggle ? 'Cancel' : 'Add Comment'}</button>
            { addCommentToggle && <button className="comment-toggle-button">Post</button> }
            </div>
            <div className="likes-block">
            <IconContext.Provider value={{ className: 'react-icons' }}>
                <div className="like-dislike-wrapper">
                    <div>{totals[0]}</div>
                    <div onClick={handleLikeToggle} className="like-wrapper">
                        { likeToggle ? 
                        <AiFillLike />
                        :
                        <AiOutlineLike />
                        }
                        
                    </div>
                    <div>{totals[1]}</div>
                    <div onClick={handleDislikeToggle} className="dislike-wrapper">
                    { dislikeToggle ? 
                        <AiFillDislike />
                        :
                        <AiOutlineDislike />
                        }
                    </div>
                </div>
            </IconContext.Provider>
            </div>
            </div>
            { addCommentToggle && <textarea onChange={handleChange} value={commentInput} className="comment-input" placeholder="Say something..." required></textarea>}
            </form>
            
            
            
            {commentsToggle &&
            <div>
                {
                    relevantComments.map(comment => <Comment key={comment._id} {...comment} />)
                }
            </div>
            }
        </div>
    )
}