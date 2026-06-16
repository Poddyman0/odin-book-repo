document.addEventListener('DOMContentLoaded', function() {
    readConversations()
    isSignedIn()
    createPostButton()

})

function isSignedIn() {
    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
    if (userTokenSignedIn === null) {
        window.location.href = "signInForm.html"
    }
}

function readConversations() {
        const postsDisplay = document.querySelector('#posts-display')

        const userId = localStorage.getItem('userIDSignedIn');
        const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
        fetch(`/socialMediaApp/post/get/posts/${userId}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'aapplication/json',
            'Authorization': `Bearer ${userTokenSignedIn}`
            },
        })
        .then(response => response.json())
        .then(response => {
            console.log("response", response.username)
            response.posts.forEach(post => {
                let postdisplay = document.createElement('div')
                postdisplay.className = "post-display"
                postdisplay.innerHTML = `
                <div id="post-username-photo-container">
                    <img id="post-profile-picture" src="${post.author.profilePictureURL}" alt="profile picture"></img>
                    <div ><strong>${post.author.username}</strong></div>
                </div>
                <div >${post.content}</div>
                <img id="post-immage" src="${post.postImargeURL}" alt="post image"></img>
                <button id="${post._id}-like-button" class="btn btn-secondary like-button">
                    <i class="bi bi-hand-thumbs-up"></i>

                    ${post.likes.length}
                </button>
                <button id="${post._id}-comment-button" class="btn btn-secondary comment-button">
                    <i class="bi bi-chat"></i>

                    ${post.comments.length}
                </button>
                <div id="${post._id}-comment-container"></div>
                
                `
                postsDisplay.appendChild(postdisplay)
                
                const commentsContainer = document.getElementById(`${post._id}-comment-container`)

                let commentToggle = false
                document.getElementById(`${post._id}-comment-button`).addEventListener("click", function (event) {
                    event.preventDefault()
                    if (commentToggle === false) {
                        commentToggle = true
                        post.comments.forEach(comment => {
                            const commentsDisplay = document.createElement('div')
                            commentsDisplay.id = "comments-display"
                            commentsDisplay.innerHTML = `
                            <img id="comment-profile-picture" src="${comment.author.profilePictureURL}"></img>
                            <div id="comments-display-user-comment">
                                <div ><strong>${comment.author.username}</strong></div>
                                <div >${comment.comment}</div>
                            </div>
                            `
                            commentsContainer.appendChild(commentsDisplay)
                        })
                            const formDisplay = document.createElement('form')
                            formDisplay.id = "comment-form"
                            formDisplay.innerHTML = `
                                <img id="post-profile-picture-comment" src="${post.author.profilePictureURL}" alt="profile picture"></img>
                                <input type="text" class="form-control comment-input" id="${post._id}-create-comment" placeholder="Enter Comment" required>
                                <button type="submit" class="btn btn-secondary comment-submit" id="${post._id}-create-comment-button"><i class="bi bi-chat"></i></button>
                            `
                            commentsContainer.appendChild(formDisplay)
                            let commentButton = document.getElementById(`${post._id}-create-comment-button`)
                            commentButton.addEventListener("click", function (event) {
                                event.preventDefault()
                                let commentValue = document.getElementById(`${post._id}-create-comment`).value
                                createComment (commentValue, post._id)
                            })

                    } else if (commentToggle === true) {
                        commentToggle = false
                        commentsContainer.innerHTML = ""

                    }
                    
                })
                
               

                let likeButton = document.getElementById(`${post._id}-like-button`)
                likeButton.addEventListener("click", function (event) {
                    event.preventDefault()
                    createLike (post._id)
                })


            });           
        })
        .catch(error => {
            console.log('Error:', error)
            document.getElementById("responseFeedback").textContent = `${error}`

        })
    }

function createComment (commentValue, postID) {
    console.log("commentValue", commentValue)
    console.log("postID", postID)
    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn')
    let userId = localStorage.getItem('userIDSignedIn');


    const updatePostBE = {
        author: userId,
        comment: commentValue
    }

    fetch(`/socialMediaApp/post/post/${postID}/usercommentpost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userTokenSignedIn}`
        },
        body: JSON.stringify(updatePostBE)
      })
      .then(response => response.json())
      .then(response => { 
        console.log("reponse", response)
        document.getElementById("responseFeedback").textContent = `${response.msg}`


      })
      .catch(error => {
        console.log("error", error)
        document.getElementById("responseFeedback").textContent = `${error}`

        });

}

function createLike (postID) {
    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn')
    let userId = localStorage.getItem('userIDSignedIn');


    const updatePostBE = {
        userID: userId
    }

    fetch(`/socialMediaApp/post/post/${postID}/likepost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userTokenSignedIn}`
        },
        body: JSON.stringify(updatePostBE)
      })
      .then(response => response.json())
      .then(response => { 
        document.getElementById("responseFeedback").textContent = `${response.msg}`


      })
      .catch(error => {
        console.log("error", error)
        document.getElementById("responseFeedback").textContent = `${error}`

        });

}


function createPostButton() {
    document.getElementById("create-post-button").addEventListener("click", function (e) {
        window.location.href = "createPost.html"
    })
}