document.addEventListener('DOMContentLoaded', function () {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkIcon = document.getElementById('darkIcon');
    const lightIcon = document.getElementById('lightIcon');
    const body = document.body;

    // Function to set the dark mode preference and update UI
    function setDarkModePreference(isDarkMode) {
        if (isDarkMode) {
            body.classList.add('dark-mode');
            darkIcon.style.display = 'none';
            lightIcon.style.display = 'inline-block';
        } else {
            body.classList.remove('dark-mode');
            darkIcon.style.display = 'inline-block';
            lightIcon.style.display = 'none';
        }

        // Store the preference in a cookie with a 30-day expiration
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        document.cookie = `darkMode=${isDarkMode}; expires=${expirationDate.toUTCString()}`;
    }

    // Function to check the dark mode preference from the cookie
    function checkDarkModePreference() {
        const darkModeCookie = document.cookie.split('; ').find(row => row.startsWith('darkMode='));
        const isDarkMode = darkModeCookie ? darkModeCookie.split('=')[1] === 'true' : false;
        setDarkModePreference(isDarkMode);
    }

    // Initial check for dark mode preference when the page loads
    checkDarkModePreference();

    // Toggle dark mode on button click
    darkModeToggle.addEventListener('click', function () {
        const isDarkMode = body.classList.contains('dark-mode');
        setDarkModePreference(!isDarkMode);
    });
});