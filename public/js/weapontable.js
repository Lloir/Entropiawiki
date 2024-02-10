$(document).ready(function () {
    let elementsCreated = false;

    function createElementsOnce(weaponData) {
        if (!elementsCreated) {
            const columns = Object.keys(weaponData[0]);
            const excludedColumns = ['ID', 'Visible', 'ImageID'];

            createCheckboxes(columns, excludedColumns);
            createTableHeaders(columns, excludedColumns);

            elementsCreated = true;
        }
    }

    function createCheckboxes(columns, excludedColumns) {
        const checkboxContainer = $('#checkboxContainer');
        columns.forEach(column => {
            if (!excludedColumns.includes(column)) {
                const checkboxId = `column${column}Checkbox`;
                checkboxContainer.append(`
                    <div class="form-check form-check-inline checkbox-wrapper"> 
                        <input type="checkbox" class="form-check-input" id="${checkboxId}" checked>
                        <label class="form-check-label" for="${checkboxId}">${column}</label>
                    </div>
                `);
            }
        });
    }

    function createTableHeaders(columns, excludedColumns) {
        const tableHead = $('#yourTable thead tr');
        columns.forEach(column => {
            if (!excludedColumns.includes(column)) {
                tableHead.append(`<th scope="col" class="column${column}">${column}</th>`);
            }
        });
    }

    $.ajax({
        url: '/api/weapon',
        method: 'GET',
        dataType: 'json',
        success: function (weaponData) {
            console.log('Fetched armor data:', weaponData);

            createElementsOnce(weaponData);

            const dataTable = initializeDataTable(weaponData);

            $(document).on('change', 'input[type="checkbox"]', function () {
                const columnClass = $(this).attr('id').replace('Checkbox', '');
                toggleColumnVisibility(dataTable, columnClass);
            });
        },
        error: function (error) {
            console.error('Error fetching Weapon data:', error);
        }
    });

    function initializeDataTable(weaponData) {
        const excludedColumns = ['ID', 'Visible', 'ImageID'];
        const columns = Object.keys(weaponData[0]).map(column => ({
            data: column,
            title: column,
            visible: !excludedColumns.includes(column)
        }));

        const dataTable = $('#weaponTable').DataTable({
            data: weaponData,
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
                console.log('Rendered DataTable HTML:', $('#weaponTable').html());
            }
        });

        addCheckboxEventListener(dataTable);

        return dataTable;
    }

    function addCheckboxEventListener(dataTable) {
        $(document).on('change', 'input[type="checkbox"]', function () {
            const columnClass = $(this).attr('id').replace('Checkbox', '');
            toggleColumnVisibility(dataTable, columnClass);
        });
    }

    function toggleColumnVisibility(dataTable, columnClass) {
        const columnIndex = dataTable.column(`.${columnClass}`).index();
        const isVisible = dataTable.column(columnIndex).visible();

        dataTable.column(columnIndex).visible(!isVisible);
    }
});