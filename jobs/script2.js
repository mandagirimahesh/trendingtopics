document.getElementById('registrationForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const whatsapp = document.getElementById('whatsapp').value;

    const scriptURL = 'https://script.google.com/macros/s/AKfycbziHzr4BFF7BWeHWuDqXIjrDoG1NSaWRbjihqwbZIsSXJ8Lp96adlc4omRQNsW7K4E/exec';

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('whatsapp', whatsapp);

    fetch(scriptURL, {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                alert('Registration successful!');
                document.getElementById('registrationForm').reset();
            } else {
                alert('Registration failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert('Registration failed. Please try again.');
        });
});
