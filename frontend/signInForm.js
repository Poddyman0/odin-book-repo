document.addEventListener('DOMContentLoaded', function() {
    signInForm()
    createAccountLink()
})
function signInForm() {
    document.querySelector('#submit').addEventListener('click', function(event) {
        event.preventDefault()
        const emailSignIn = document.querySelector('#email-sign-in')
        const passwordSignIn = document.querySelector('#password-sign-in')
        let signInBody = {
            email: emailSignIn.value,
            password: passwordSignIn.value
        }
        let responseProfileID = ""
        console.log("emailSignIn.value", emailSignIn.value)
        console.log("encodeURIComponent(emailSignIn.value)",  encodeURIComponent(emailSignIn.value))
        fetch(`http://localhost:3000/socialMediaApp/user/get/auserEmail/${encodeURIComponent(emailSignIn.value)}`, {
            method: 'GET', 
            headers: {
            'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(response => {
            console.log("1", response)
            responseProfileID = `${response.profile[0]._id}`
            fetch(`http://localhost:3000/socialMediaApp/user/put/signin/${response.profile[0]._id}/JWTBycrypt`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(signInBody)
            })
            .then(response => response.json())
            .then(response => {
                console.log("2", response)

                document.getElementById("responseFeedback").textContent = `${response.msg}`
                localStorage.setItem('userIDSignedIn', response.userIDSignInCreated);
                localStorage.setItem('userTokenSignedIn', response.token); 
                const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');

                //
                fetch(`http://localhost:3000/socialMediaApp/user/put/signin/${responseProfileID}/passport`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userTokenSignedIn}`
                },
                body: JSON.stringify(signInBody)
                })
                .then(response => response.json())
                .then(response => {
                    const userTokenSignedIn = localStorage.getItem('userTokenSignedIn');
                    console.log("userTokenSignedIn", userTokenSignedIn)
                    console.log("response 3", response)
                   // window.location.href = "readProfile.html"

                })
                .catch(error => {
                    console.log("error", error)
                })


                //

            })
        })
        .catch(error => {
            console.log('Error:', error)
            document.getElementById("responseFeedback").textContent = `${error}`

        })
    })
}

function createAccountLink() {
    document.getElementById("btn-create-account").addEventListener("click", function(event) {
        event.preventDefault()
        window.location.href = "createProfile.html"
    })
}

