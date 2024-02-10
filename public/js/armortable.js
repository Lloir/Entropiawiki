// Function to exclude certain columns
function excludeColumn(column) {
    return ['ID', 'Visible', 'ImageID'].includes(column);
}

$(document).ready(function () {
    let elementsCreated = false;

    function createCheckboxesAndHeaders(armorData) {
        if (!elementsCreated) {
            const columns = Object.keys(armorData[0]);

            createCheckboxes(columns);
            createTableHeaders(columns);

            elementsCreated = true;
        }
    }

    function createCheckboxes(columns) {
        const checkboxContainer = $('#checkboxContainer');
        columns.forEach(column => {
            if (!excludeColumn(column)) {
                const checkboxId = `column${column}Checkbox`;
                checkboxContainer.append(`
                    <div class="form-check form-check-inline">
                        <input type="checkbox" class="form-check-input" id="${checkboxId}" checked>
                        <label class="form-check-label" for="${checkboxId}">${column}</label>
                    </div>
                `);
            }
        });
    }

    function createTableHeaders(columns) {
        const tableHead = $('#yourTable thead tr');
        columns.forEach(column => {
            if (!excludeColumn(column)) {
                tableHead.append(`<th scope="col" class="column${column}">${column}</th>`);
            }
        });
    }

    $.ajax({
        url: '/api/armor',
        method: 'GET',
        dataType: 'json',
        success: function (armorData) {
            console.log('Fetched armor data:', armorData);

            createCheckboxesAndHeaders(armorData);

            const dataTable = initializeDataTable(armorData);

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

function initializeDataTable(armorData) {
    const columns = Object.keys(armorData[0]).map(column => {
        return excludeColumn(column)
            ? { data: column, visible: false }
            : { data: column, title: column, visible: true };
    });

    return $('#yourTable').DataTable({
        data: armorData,
        responsive: true,
        columns: columns,
        paging: true,
        scrollCollapse: true,
        scrollY: '50vh',
        scrollX: true,
        autoWidth: true,
        ordering: true,
        pagingType: "full",
        dom: '<"top"f>rt<"bottom"lip><"clear">',
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        pageLength: 20,
        drawCallback: function (settings) {
            console.log('Rendered DataTable HTML:', $('#yourTable').html());
        }
    });
}

function toggleColumnVisibility(dataTable, columnClass) {
    const columnIndex = dataTable.column(`.${columnClass}`).index();
    const isVisible = dataTable.column(columnIndex).visible();

    dataTable.column(columnIndex).visible(!isVisible);
}
