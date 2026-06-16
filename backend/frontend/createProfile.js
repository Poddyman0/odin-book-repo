document.addEventListener('DOMContentLoaded', function() {
    createUser()
    getUsers() 
    isSignedIn()
})

function isSignedIn() {
    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
    console.log("userTokenSignedIn", userTokenSignedIn)
    if (userTokenSignedIn === null) {
        window.location.href = "signInForm.html"
    }
}

function getUsers () {
    const addFollowingRadioContainer = document.getElementById('add-following-radio-container')
    const userId = localStorage.getItem('userIDSignedIn');
    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
    fetch(`odin-book-repo-production.up.railway.app/socialMediaApp/users/get`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userTokenSignedIn}`
        },
    })
    .then(response => response.json())
    .then(response => {
        console.log("response", response)
        response.users.forEach((user) => {
            let aUserToDisplay = document.createElement('div')
            aUserToDisplay.innerHTML = 
            `
                <div class="form-check">
                <input class="form-check-input friendCheckBox" type="checkbox" value="${user.username}" id="${user._id}" >
                <label class="form-check-label" for="flexRadioDefault1">
                ${user.username}
                </label>
                </div>
            `
            addFollowingRadioContainer.appendChild(aUserToDisplay)

        })
    })
    .catch(error => {
        console.log('Error:', error)
        document.getElementById("responseFeedback").textContent = `${error}`

    })
    
}

function createUser () {


    document.querySelector('#submit').addEventListener('click', function(event) {
        event.preventDefault()
        const profileInfo = document.querySelector('#create-profile-info')
        const profileUsername = document.querySelector('#create-profile-username')
        const profileEmail = document.querySelector('#create-profile-email')
        const profilePassword = document.querySelector('#create-profile-password')
        console.log("profilePassword.value", profilePassword.value)
        let createProfileBE = {
            profilePictureURL: "placeholder",
            profileInfo: profileInfo.value,
            username: profileUsername.value,
            email: profileEmail.value,
            password: profilePassword.value,
            followingRequests: [],
            followingAcceptance: [],
            followersRequest: [],
            followersAcceptance: []
        }


        document.querySelectorAll(".friendCheckBox").forEach((checkbox) => {

            if (checkbox.checked) {
                createProfileBE.followingRequests.push(
                    checkbox.id   
                );

            }

        });
        console.log("createProfileBE", createProfileBE)

        fetch('odin-book-repo-production.up.railway.app/socialMediaApp/user/post', {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
            },
            body: JSON.stringify(createProfileBE)})
                .then(response => response.json())
                .then(response => {
                    console.log("response", response)
                    document.getElementById("responseFeedback").textContent = `${response.msg}`
                    createProfilePicture(response.userID)


                })
                .catch(error => {
                    console.log('Error:', error);
                    document.getElementById("responseFeedback").textContent = `${error}`

                });
    })
}

function createProfilePicture (userID) {

    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("image", file);

    fetch(`odin-book-repo-production.up.railway.app/socialMediaApp/user/put/${userID}/profileimageupload`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${userTokenSignedIn}`
      },
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      console.log("response URL", data);
    window.location.href = "readProfile.html"

    })
    .catch(err => {
      console.log("error", err);
    });
}