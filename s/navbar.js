// includeNavbar.js
document.addEventListener("DOMContentLoaded", function() {
    // Fetch and include the navbar
    fetch('../h/navbar.html')
        .then(response => response.text())
        .then(navbarHtml => {
            document.getElementById('navbarContainer').innerHTML = navbarHtml;
        })
        .catch(error => console.error('Error fetching navbar:', error));
});