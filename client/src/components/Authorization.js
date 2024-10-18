export const Authorization = async () => {
    let myToken = localStorage.getItem('token');
    if (myToken) {
        const auth = {
            token: myToken
        };
        console.log("Fetching auth");
        fetch('http://localhost:8000/isAuthorized', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(auth),
        })
        .then(res => res.json())
        .then(data => {
            const isAuthorized = data.response;
            console.log(isAuthorized);
            if (!isAuthorized)
                window.location.href = window.location.origin + '/Login';
        });
    }
    else
        window.location.href = window.location.orgin + '/Login';
}