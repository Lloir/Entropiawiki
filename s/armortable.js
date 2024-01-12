$(document).ready(function () {
    // Flag to check if elements are already created
    let elementsCreated = false;

    // Function to create checkboxes and th elements
    function createElementsOnce(armorData) {
        if (!elementsCreated) {
            // Extract column names from the first armor object
            const columns = Object.keys(armorData[0]);

            // Dynamically create checkboxes for column visibility
            const checkboxContainer = $('#checkboxContainer');
            columns.forEach(column => {
                // Exclude ID, Visible, and ImageID from being displayed and have filters
                if (column !== 'ID' && column !== 'Visible' && column !== 'ImageID') {
                    const checkboxId = `column${column}Checkbox`;
                    checkboxContainer.append(`
                        <div class="form-check form-check-inline">
                            <input type="checkbox" class="form-check-input" id="${checkboxId}" checked>
                            <label class="form-check-label" for="${checkboxId}">${column}</label>
                        </div>
                    `);
                }
            });

            // Dynamically create th elements for columns
            const tableHead = $('#yourTable thead tr');
            columns.forEach(column => {
                // Exclude ID, Visible, and ImageID from being displayed and have filters
                if (column !== 'ID' && column !== 'Visible' && column !== 'ImageID') {
                    tableHead.append(`<th scope="col" class="column${column}">${column}</th>`);
                }
            });

            // Set the flag to true
            elementsCreated = true;
        }
    }

    // Fetch armor data from the server and dynamically create checkboxes and columns
    $.ajax({
        url: '/api/armor',
        method: 'GET',
        dataType: 'json',
        success: function (armorData) {
            console.log('Fetched armor data:', armorData);

            // Call the function to create elements once
            createElementsOnce(armorData);

            // Initialize DataTable with dynamically created columns
            const dataTable = $('#yourTable').DataTable({
                data: armorData,
                columns: Object.keys(armorData[0]).map(column => {
                    // Exclude ID, Visible, and ImageID from being displayed and have filters
                    if (column !== 'ID' && column !== 'Visible' && column !== 'ImageID') {
                        return {
                            data: column,
                            title: column,
                            visible: true, // Initially set all columns to visible
                        };
                    } else {
                        return {
                            data: column,
                            visible: false, // Exclude these columns by default
                        };
                    }
                }),
                paging: true,
                autoWidth: true,
                ordering: true,
                pagingType: "full",
                dom: '<"top"f>rt<"bottom"lip><"clear">',
                paging: true,
                lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
                pageLength: 20,
                drawCallback: function (settings) {
                    console.log('Rendered DataTable HTML:', $('#yourTable').html());
                }
            });

            // Event listener for checkboxes to toggle column visibility
            $(document).on('change', 'input[type="checkbox"]', function () {
                const columnClass = $(this).attr('id').replace('Checkbox', '');
                toggleColumnVisibility(dataTable, columnClass);
            });
        },
        error: function (error) {
            console.error('Error fetching armor data:', error);
        }
    });
});

// Function to toggle column visibility
function toggleColumnVisibility(dataTable, columnClass) {
    const columnIndex = dataTable.column(`.${columnClass}`).index();
    const isVisible = dataTable.column(columnIndex).visible();

    dataTable.column(columnIndex).visible(!isVisible);
}
