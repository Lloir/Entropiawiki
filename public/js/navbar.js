document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Fetch and include the navbar
        const response = await fetch('../h/navbar.html');
        const navbarHtml = await response.text();

        document.getElementById('navbarContainer').innerHTML = navbarHtml;

        // Add search functionality
        const searchInputNavbar = document.getElementById('searchInputNavbar');
        const searchButtonNavbar = document.getElementById('searchButtonNavbar');

        if (searchInputNavbar && searchButtonNavbar) {
            const redirectToSearch = () => {
                const searchTerm = searchInputNavbar.value;
                // Redirect to search.html with the search term
                window.location.href = `../search.html`;
            };

            // Handle Enter key press in the search input
            searchInputNavbar.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    redirectToSearch();
                }
            });

            // Handle search button click
            searchButtonNavbar.addEventListener('click', redirectToSearch);
        } else {
            console.error('Search elements not found in the navbar.');
        }
    } catch (error) {
        console.error('Error fetching or processing navbar HTML:', error);
    }
});
