$(document).ready(function () {
    // Function to populate the vehicle table
    function populateVehicleTable(data) {
        const tableBody = $('#vehicleTable tbody');
        tableBody.empty();

        // Iterate through the fetched data and create table rows
        data.forEach((vehicle) => {
            const row = `
                <tr>
                    <td>${vehicle.VehicleName}</td>
                    <td>${vehicle.Type}</td>
                    <td>${vehicle.Price}</td>
                </tr>
            `;
            tableBody.append(row);
        });

        // Handle click event to display expanded details in modal
        $('#vehicleTable tbody tr').on('click', function () {
            const rowIndex = $(this).index();
            const selectedVehicle = data[rowIndex];
            showExpandedDetails(selectedVehicle);
        });
    }

    // Function to show expanded details in the modal
    function showExpandedDetails(vehicle) {
        $('#expandModalBody').html(`
            <p><strong>Name:</strong> ${vehicle.VehicleName}</p>
            <p><strong>Name:</strong> ${vehicle.Type}</p>
            <p><strong>Price:</strong> ${vehicle.Price}</p>
        `);
        $('#expandModal').modal('show');
    }

    // Fetch data from the /vehicles API endpoint
    $.get('/api/vehicles', function (data) {
        populateVehicleTable(data);
    })
        .fail(function (error) {
            console.error('Error fetching data:', error.responseText);
            alert('Failed to fetch data from the server.');
        });
});
