document.addEventListener('DOMContentLoaded', function() {
    readUsers()
    isSignedIn()

})

function isSignedIn() {
    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
    console.log("userTokenSignedIn", userTokenSignedIn)
    if (userTokenSignedIn === null) {
        window.location.href = "signInForm.html"
    }
}

function readUsers() {
    const profilesDisplay = document.querySelector('#profiles-display')

    const userId = localStorage.getItem('userIDSignedIn');
        const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');

        fetch(`http://localhost:3000/socialMediaApp/users/get/${userId}/followrequest`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userTokenSignedIn}`
            },
        })
        .then(response => response.json())
        .then(response => {
            console.log("response", response)
            response.users.forEach(user => {

                const userDisplay = document.createElement('div');
                userDisplay.id = "follower-card"
                userDisplay.innerHTML = `
                    <img id="follow-profile-picture" src="${user.profilePictureURL}"></img>
                    <div id="username-button-container">
                        <div >${user.username}</div>
                        <button class="btn btn-primary add-following" id="${user._id}">
                            Follow User
                        </button>
                    </div>
                `;
            
                profilesDisplay.appendChild(userDisplay);
            
                const addFollowerButton =
                    userDisplay.querySelector(".add-following");
            
                addFollowerButton.addEventListener('click', function(event) {
                    console.log("click")
                    updateFollowers(addFollowerButton.id)
            
                });
            
            });
            updateFollowers()
        })
        .catch(error => {
            console.log('Error:', error)

        })
        
}

function updateFollowers(followerID) {
    console.log("followerID", followerID)


        const userId = localStorage.getItem('userIDSignedIn');
        const userTokenSignedIn = localStorage.getItem('userTokenSignedIn')
        const updateProfileBE = {
            followingRequest: followerID,
            
        }
        fetch(`http://localhost:3000/socialMediaApp/user/put/${userId}/userfollingupdate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userTokenSignedIn}`
            },
            body: JSON.stringify(updateProfileBE)
          })
          .then(response => response.json())
          .then(response => { 
            console.log("reponse", response)
            document.getElementById("responseFeedback").textContent = `${response.msg}`


          })
          .catch(error => {
            console.log("error", error)

            });


}