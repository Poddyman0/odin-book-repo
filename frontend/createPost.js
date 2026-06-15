document.addEventListener('DOMContentLoaded', function() {
    createPost()
    isSignedIn()
    getProfileAndPosts()

})

function isSignedIn() {
    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
    console.log("userTokenSignedIn", userTokenSignedIn)
    if (userTokenSignedIn === null) {
        window.location.href = "signInForm.html"
    }
}

function getProfileAndPosts() {
    const userId = localStorage.getItem('userIDSignedIn');
    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');

    fetch(`http://localhost:3000/socialMediaApp/user/get/${userId}/getuserandposts`, {
            method: 'GET', 
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userTokenSignedIn}`
            },
        })
        .then(response => response.json())
        .then(response => {
            const profileContainer = document.getElementById("profile-container")
            const profileDisplay = document.createElement('div')
            profileDisplay.id = 'profile-box'
            profileDisplay.innerHTML = `
            <img id="profile-picture" src="${response.user.profilePictureURL}" alt="profile picture"></img>
            <div id="profile-username"><strong>${response.user.username}</strong></div>
            `
            profileContainer.appendChild(profileDisplay)
        }).catch(error => {
            console.log("error", error)
        })  
} 

function createPost() {
        document.querySelector('#submit').addEventListener('click', function(event) {
            event.preventDefault()
            const content = document.getElementById("create-post-content").value
            const userId = localStorage.getItem('userIDSignedIn');
            const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');


            let createPostBE = {
                content: content,
                author: userId,
                likes: [],
                comments: []
            }
            fetch('http://localhost:3000/socialMediaApp/post/post', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", 
                    'Authorization': `Bearer ${userTokenSignedIn}`

                },
                body: JSON.stringify(createPostBE)})
                    .then(response => response.json())
                    .then(response => {
                        console.log("response", response)
                        document.getElementById("responseFeedback").textContent = `${response.msg}`
                        createPicture(response.post._id)
                        
    
    
                    })
                    .catch(error => {
                        console.log('Error:', error);
                        document.getElementById("responseFeedback").textContent = `${error}`
    
                    });
        })
}

function createPicture (postID) {
    console.log("postID", postID)
    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("image", file);

    fetch(`http://localhost:3000/socialMediaApp/post/post/${postID}/postimageupload`, {
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
