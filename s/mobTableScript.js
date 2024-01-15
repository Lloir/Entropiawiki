$(document).ready(function () {
    // Flag to check if elements are already created
    let elementsCreated = false;

    // Function to create checkboxes and th elements
    function createElementsOnce(mobDataTable) {
        if (!elementsCreated) {
            // Extract column names from the first table object
            const columns = Object.keys(mobDataTable[0]);

            // Dynamically create checkboxes for column visibility
            const checkboxContainer = $('#checkboxContainer');
            columns.forEach(column => {
                const checkboxId = `column${column}Checkbox`;
                checkboxContainer.append(`
                    <div class="form-check form-check-inline">
                        <input type="checkbox" class="form-check-input" id="${checkboxId}" checked>
                        <label class="form-check-label" for="${checkboxId}">${column}</label>
                    </div>
                `);
            });

            // Dynamically create th elements for columns
            const tableHead = $('#mobDataTable thead tr');
            columns.forEach(column => {
                if (column !== 'LootNames') {
                    tableHead.append(`<th scope="col" class="column${column}">${column}</th>`);
                } else {
                    tableHead.append(`<th scope="col" class="column${column}">
                        <button type="button" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#lootNamesModal">
                            Loot Names
                        </button>
                    </th>`);
                }
            });

            // Set the flag to true
            elementsCreated = true;
        }
    }

    // Fetch table data from the server and dynamically create checkboxes and columns
    $.ajax({
        url: '/api/allData',
        method: 'GET',
        dataType: 'json',
        success: function (mobDataTable) {
            console.log('Fetched mobDataTable:', mobDataTable);

            // Call the function to create elements once
            createElementsOnce(mobDataTable);

            // Initialize DataTable with dynamically created columns
            const dataTable = $('#mobDataTable').DataTable({
                data: mobDataTable,
                columns: Object.keys(mobDataTable[0]).map(column => {
                    if (column !== 'LootNames') {
                        return {
                            data: column,
                            title: column,
                            visible: true, // Initially set all columns to visible
                        };
                    } else {
                        return {
                            data: function (row) {
                                return row.LootNames;
                            },
                            title: column,
                            visible: true,
                            render: function (data, type, row) {
                                if (type === 'display') {
                                    return `<button type="button" class="btn btn-link loot-names-btn" data-bs-toggle="modal" data-bs-target="#lootNamesModal" data-loot-names="${data}">View</button>`;
                                }
                                return data;
                            }
                        };
                    }
                }),
                paging: true,
                autoWidth: true,
                ordering: true,
                pagingType: "full",
                dom: '<"top"f>rt<"bottom"lip><"clear">',
                lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
                pageLength: 20,
                drawCallback: function (settings) {
                    console.log('Rendered DataTable HTML:', $('#mobDataTable').html());
                }
            });

            // Event listener for checkboxes to toggle column visibility
            $(document).on('change', 'input[type="checkbox"]', function () {
                const columnClass = $(this).attr('id').replace('Checkbox', '');
                toggleColumnVisibility(dataTable, columnClass);
            });

        },
        error: function (error) {
            console.error('Error fetching mobDataTable:', error);
        }
    });
});

// Function to toggle column visibility
function toggleColumnVisibility(dataTable, columnClass) {
    const columnIndex = dataTable.column(`.${columnClass}`).index();
    const isVisible = dataTable.column(columnIndex).visible();

    dataTable.column(columnIndex).visible(!isVisible);
}

// Handle row click event to populate the modal content
$('#mobTable tbody').on('click', 'tr', function () {
    const data = dataTable.row(this).data();
    const lootContent = data.LootNames.length ? data.LootNames.join('<br>') : 'No drops';
    $('#expandModalBody').html(lootContent);
});
