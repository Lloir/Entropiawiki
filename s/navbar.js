document.addEventListener("DOMContentLoaded", function () {
    // Fetch and include the navbar
    fetch('../h/navbar.html')
        .then(response => response.text())
        .then(navbarHtml => {
            document.getElementById('navbarContainer').innerHTML = navbarHtml;

            // Add search functionality
            const searchInputNavbar = document.getElementById('searchInputNavbar');
            const searchButtonNavbar = document.getElementById('searchButtonNavbar');

            if (searchInputNavbar && searchButtonNavbar) {
                const redirectToSearch = function () {
                    const searchTerm = searchInputNavbar.value;
                    // Redirect to search.html with the search term
                    window.location.href = `../h/search.html?term=${searchTerm}`;
                };

                // Handle Enter key press in the search input
                searchInputNavbar.addEventListener('keypress', function (event) {
                    if (event.key === 'Enter') {
                        redirectToSearch();
                    }
                });

                // Handle search button click
                searchButtonNavbar.addEventListener('click', redirectToSearch);
            } else {
                console.error('Search elements not found in the navbar.');
            }
        });
});