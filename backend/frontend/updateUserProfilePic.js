document.addEventListener('DOMContentLoaded', function() {
    //getUserPic()
    isSignedIn()
    getUserPic()
})

function isSignedIn() {
    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
    console.log("userTokenSignedIn", userTokenSignedIn)
    if (userTokenSignedIn === null) {
        window.location.href = "signInForm.html"
    }
}

function getUserPic() {
        const userPicURL = document.querySelector('#update-user-profile-pic')
        let userId = localStorage.getItem('userIDSignedIn');
        const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');

                fetch(`odin-book-repo-production.up.railway.app/socialMediaApp/user/get/${userId}/userprofilepictureget`, {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userTokenSignedIn}`
                    },
                })
                .then(response => response.json())
                .then(response => {
                    console.log(response)
                    let profilePicContainer = document.getElementById("profile-picture-container")
                    let profilePicDisplay = document.createElement('img')
                    profilePicDisplay.id = "profile-picture-id"
                    profilePicDisplay.src = `${response.user.profilePictureURL}`
                    profilePicDisplay.alt = "profile-picture"
                    profilePicContainer.appendChild(profilePicDisplay)
                    userPicURL.value = response.user.profilePictureURL
                    updateUserPic()
                })
                .catch(error => {
                    console.log("error", error)

                });
}

function updateUserPic () {
    const form = document.getElementById("uploadForm");
      
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // stops page refresh
  
      const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
      const userId = localStorage.getItem('userIDSignedIn');

      const fileInput = document.getElementById("fileInput");
      const file = fileInput.files[0];
  
  
      const formData = new FormData();
      formData.append("image", file);
  
      fetch(`odin-book-repo-production.up.railway.app/socialMediaApp/user/put/${userId}/profileimageupload`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${userTokenSignedIn}`
        },
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        console.log("response URL", data);
      })
      .catch(err => {
        console.log("error", err);
      });
    });
}

/*
HTML:
<form id="update-conversation-form">
  <div class="form-group">
   
      <div id="profile-picture-container"></div>
      <label for="update-user-profile-pic"><strong>Profile Picture URL:</strong></label>
      <input type="text" class="form-control" id="update-user-profile-pic"  required>
      <br>
      <button type="submit" class="btn btn-primary" id="btn-update-profile-pic">Save</button>
      <div id="responseFeedback"></div>
</form>

JS:
        const userPicURL = document.querySelector('#update-user-profile-pic')

        const userTokenSignedIn = localStorage.getItem('userTokenSignedIn')
        let userId = localStorage.getItem('userIDSignedIn');

        const updateUserBE = {
            profilePictureURL: userPicURL.value
        }

        fetch(`odin-book-repo-production.up.railway.app/socialMediaApp/user/put/${userId}/userprofilepictureupdate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userTokenSignedIn}`
            },
            body: JSON.stringify(updateUserBE)
          })
          .then(response => response.json())
          .then(response => { 
            console.log("reponse", response)
            document.getElementById("responseFeedback").textContent = `${response.msg}`


          })
          .catch(error => {
            console.log("error", error)

            });


    })
*/
