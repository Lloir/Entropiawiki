$(document).ready(function () {
    const vehicleTableBody = $('#vehicleTable tbody');

    // Function to create a table row for a vehicle
    function createVehicleRow(vehicle) {
        return `
            <tr>
                <td>${vehicle.VehicleName}</td>
                <td>${vehicle.Type}</td>
                <td>${vehicle.Price}</td>
            </tr>
        `;
    }

    // Function to populate the vehicle table with data
    function populateVehicleTable(data) {
        vehicleTableBody.empty();

        // Iterate through the fetched data and create table rows
        data.forEach((vehicle) => {
            const row = createVehicleRow(vehicle);
            vehicleTableBody.append(row);
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
            <p><strong>Type:</strong> ${vehicle.Type}</p>
            <p><strong>Price:</strong> ${vehicle.Price}</p>
        `);
        $('#expandModal').modal('show');
    }

    // Fetch data from the /api/vehicles API endpoint
    $.ajax({
        url: '/api/vehicles',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            populateVehicleTable(data);
        },
        error: function (error) {
            console.error('Error fetching data:', error.responseText);
            alert('Failed to fetch data from the server.');
        }
    });
});
