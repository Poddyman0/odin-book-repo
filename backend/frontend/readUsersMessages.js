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

        fetch(`/socialMediaApp/users/get/${userId}/followrequest`, {
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
                            Message User
                        </button>
                    </div>
                `;
            
                profilesDisplay.appendChild(userDisplay);
            
                const addFollowerButton =
                    userDisplay.querySelector(".add-following");
            
                addFollowerButton.addEventListener('click', function(event) {
                    console.log("click")
                    localStorage.setItem('userToMessage', addFollowerButton.id);
                    window.location.href = '/socketChat.html'
            
                });
            
            });
        })
        .catch(error => {
            console.log('Error:', error)

        })
        
}
