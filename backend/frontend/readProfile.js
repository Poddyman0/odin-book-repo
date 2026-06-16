document.addEventListener('DOMContentLoaded', function() {
    getProfileAndPosts()
    isSignedIn()
    signOutButton()

})
function isSignedIn() {
    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
    if (userTokenSignedIn === null) {
        window.location.href = "signInForm.html"
    }
}


function getProfileAndPosts() {
    const userId = localStorage.getItem('userIDSignedIn');
    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');

    fetch(`odin-book-repo-production.up.railway.app/socialMediaApp/user/get/${userId}/getuserandposts`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userTokenSignedIn}`
        },
    })
    .then(response => response.json())
    .then(response => {
        const userProfileAndPostsContainer = document.getElementById("get-profile-and-posts-container");
        const userProfileAndPosts = document.createElement('div');
        userProfileAndPosts.innerHTML = `
            <div id="top-profile-container">
                <div id="profile-pic-username-container">
                    <img id="profile-picture" src="${response.user.profilePictureURL}" alt="profile pciture"></img>
                    <div><strong>${response.user.username}</strong></div>
                </div>

                <div id="profile-buttons-container">
                    <button class="btn btn-primary" id="story-btn">Add to story</button>
                    <button class="btn btn-secondary" id="edit-btn">Edit profile</button>
                    <button  id="signOut" class="btn btn-primary btn-sign-out">Sign Out</button>

                </div>
            </div>

            <div id="personal-details-container">
                <div><strong>Personal details</strong></div>
                <div>${response.user.profileInfo}</div>
            </div>
            <div id="follow-container">
                <div><strong>Users you've requested to follow:</strong></div>
                <div id="following-requests-container"></div>
                <div><strong>Users you are following:</strong></div>
                <div id="following-acceptance-controller"></div>
                <div><strong>Users that have requested to follow you</strong></div>
                <div id="followers-request-container"></div>
                <div><strong>Users that have accepted them following you.</strong></div>
                <div id="followers-acceptance-container"></div>
            </div>
            <div id="posts-container"></div>
        `;
        userProfileAndPostsContainer.appendChild(userProfileAndPosts);
        document.getElementById('story-btn').addEventListener("click", function (event) {
            window.location.href = "createPost.html"
        })
        document.getElementById('edit-btn').addEventListener("click", function (event) {
            window.location.href = "updateUserProfilePic.html"
        })
        const followingRequestsContainer = document.getElementById("following-requests-container")

        response.user.followingRequests.forEach(follow => {
            const followingRequest = document.createElement('div')
            followingRequest.innerHTML = `
            <img alt="follow-picture" class="follow-picture" src="${follow.profilePictureURL}"></img>
            <div class="follow-username">${follow.username}</div>

            `
            followingRequestsContainer.appendChild(followingRequest)
        })

        const followingAcceptanceContainer = document.getElementById("following-acceptance-controller")

        response.user.followingAcceptance.forEach(follow => {
            const followingAcceptance = document.createElement('div')
            followingAcceptance.innerHTML = `
            <img alt="follow-picture" class="follow-picture" src="${follow.profilePictureURL}"></img>
            <div class="follow-username">${follow.username}</div>

            `
            followingAcceptanceContainer.appendChild(followingAcceptance)
        })

        const followersRequestContainer = document.getElementById("followers-request-container")

        response.user.followersRequest.forEach(follow => {
            const followerRequest = document.createElement('div')
            followerRequest.innerHTML = `
            <img alt="follow-picture" class="follow-picture" src="${follow.profilePictureURL}"></img>
            <div class="follow-username">${follow.username}</div>

            `
            followersRequestContainer.appendChild(followerRequest)
        })

        const followersAcceptanceContainer = document.getElementById("followers-acceptance-container")

        response.user.followersAcceptance.forEach(follow => {
            const followerAcceptance = document.createElement('div')
            followerAcceptance.innerHTML = `
            <img alt="follow-picture" class="follow-picture" src="${follow.profilePictureURL}"></img>
            <div class="follow-username">${follow.username}</div>

            `
            followersAcceptanceContainer.appendChild(followerAcceptance)
        })

        const postsContainer = document.getElementById("posts-container");

            response.user.userPosts.forEach(post => {
                const aPost = document.createElement('div');
                aPost.className = "post-display";

                aPost.innerHTML = `
                    <div class="post-username-photo-container">
                        <img class="post-profile-picture" src=${post.user.profilePictureURL}></img>
                        <div><strong>${post.user.username}</strong></div>
                    </div>

                    <div>${post.content}</div>

                    <img class="post-immage" src="${post.postImageURL}"></img>

                    <button id="${post._id}-like-button" class="btn btn-secondary like-button">
                        <i class="bi bi-hand-thumbs-up"></i>
                        ${post.likes.length}
                    </button>

                    <button id="${post._id}-comment-button" class="btn btn-secondary comment-button">
                        <i class="bi bi-chat"></i>
                        ${post.comments.length}
                    </button>

                    <div id="${post._id}-comment-container"></div>
                `;

                postsContainer.appendChild(aPost);

                const commentsContainer = document.getElementById(`${post._id}-comment-container`);

                let commentToggle = false;

                // COMMENT BUTTON
                document.getElementById(`${post._id}-comment-button`)
                .addEventListener("click", function (event) {

                    event.preventDefault();

                    if (commentToggle === false) {

                        commentToggle = true;

                        post.comments.forEach(comment => {


                            const commentsDisplay = document.createElement('div');

                            commentsDisplay.className = "comments-display";

                            commentsDisplay.innerHTML = `
                                <img class="comment-profile-picture" src="${comment.author.profilePictureURL}" alt="post comment photo"></img>

                                <div class="comments-display-user-comment">
                                    <div><strong>${comment.author.username}</strong></div>
                                    <div>${comment.comment}</div>
                                </div>
                            `;

                            commentsContainer.appendChild(commentsDisplay);

                        }); // closes post.comments.forEach

                        const formDisplay = document.createElement('form');

                        formDisplay.className = "comment-form";

                        formDisplay.innerHTML = `
                        <img class="post-profile-picture-comment" src="${post.user.profilePictureURL}" alt="profile picture"></img>
                        <input type="text" class="form-control comment-input" id="${post._id}-create-comment" placeholder="Enter Comment" required>
                        <button type="submit" class="btn btn-secondary comment-submit" id="${post._id}-create-comment-button"><i class="bi bi-chat"></i></button> 
                        `;

                        commentsContainer.appendChild(formDisplay);

                        let commentButton = document.getElementById(`${post._id}-create-comment-button`);

                        commentButton.addEventListener("click", function (event) {

                            event.preventDefault();

                            let commentValue =
                                document.getElementById(`${post._id}-create-comment`).value;

                            createComment(commentValue, post._id);

                        }); // closes create comment button listener

                    } else if (commentToggle === true) {

                        commentToggle = false;

                        commentsContainer.innerHTML = "";

                    }

                }); // closes comment button listener

                // LIKE BUTTON
                let likeButton = document.getElementById(`${post._id}-like-button`);

                likeButton.addEventListener("click", function (event) {
                    console.log("post", post)
                    event.preventDefault();
                    createLike(post._id);
                }); // closes like button listener

            }); // closes response.user.userPosts.forEach

    }) // closes .then(response => {
    
    .catch(error => {

        console.log("error", error);

    });

} // closes getProfileAndPosts


    function createComment (commentValue, postID) {
        console.log("commentValue", commentValue)
        console.log("postID", postID)
        const userTokenSignedIn = localStorage.getItem('userTokenSignedIn')
        let userId = localStorage.getItem('userIDSignedIn');
    
    
        const updatePostBE = {
            author: userId,
            comment: commentValue
        }
    
        fetch(`odin-book-repo-production.up.railway.app/socialMediaApp/post/post/${postID}/usercommentpost`, {
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
            //document.getElementById("responseFeedback").textContent = `${response.msg}`
    
    
          })
          .catch(error => {
            console.log("error", error)
            //document.getElementById("responseFeedback").textContent = `${error}`
    
            });
    
    }
    
    function createLike (postID) {
        console.log("click")

        const userTokenSignedIn = localStorage.getItem('userTokenSignedIn')
        let userId = localStorage.getItem('userIDSignedIn');
    
    
        const updatePostBE = {
            userID: userId
        }
    
        fetch(`odin-book-repo-production.up.railway.app/socialMediaApp/post/post/${postID}/likepost`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userTokenSignedIn}`
            },
            body: JSON.stringify(updatePostBE)
          })
          .then(response => response.json())
          .then(response => { 
            console.log("response", response)
          //  document.getElementById("responseFeedback").innerHTML = `${response.msg}`
    
    
          })
          .catch(error => {
            console.log("error", error)
            //document.getElementById("responseFeedback").innerHTML = `${error}`
    
            });
    
    }


function signOutButton() {
    document.getElementById("signOut").addEventListener('click', function() {
        const userId = localStorage.getItem('userIDSignedIn');
        const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
        const signOutProfileBD ={

        }
                    fetch(`odin-book-repo-production.up.railway.app/socialMediaApp/user/put/signout/${userId}/passport`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
            
                        },
                        body: JSON.stringify(signOutProfileBD)})
                        .then(response => response.json())
                        .then(response => {
                            console.log("response 3", response)
                            localStorage.removeItem('userIDSignedIn');
                            localStorage.removeItem('userTokenSignedIn');

                            window.location.href = "signInForm.html";

                        })
                        .catch(error => {
                            console.log("error", error)
                        })

})
}