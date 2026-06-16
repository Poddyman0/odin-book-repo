document.addEventListener('DOMContentLoaded', function() {
getImage ()

})

function getImage ( ) {
        const form = document.getElementById("uploadForm");
      
        form.addEventListener("submit", function (e) {
          e.preventDefault(); // stops page refresh
      
          const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
          const fileInput = document.getElementById("fileInput");
          const file = fileInput.files[0];
          const formData = new FormData();
          formData.append("image", file);
      
          fetch(`http://localhost:3000/socialMediaApp/`, {
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