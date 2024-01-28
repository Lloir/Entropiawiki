$(document).ready(function () {
    // Destroy existing DataTable if it exists
    if ($.fn.DataTable.isDataTable('#mobTable')) {
        $('#mobTable').DataTable().destroy();
    }

    // Fetch all data from the server
    $.ajax({
        url: '/api/mobs',
        method: 'GET',
        dataType: 'json',
        success: function (allData) {
            console.log('Fetched all data:', allData);

            // Group loot drops by mob name (case-insensitive)
            const mobDataGrouped = {};

            allData.forEach(item => {
                const mobNameKey = item.MobName.toLowerCase();

                if (!mobDataGrouped[mobNameKey]) {
                    mobDataGrouped[mobNameKey] = {
                        MobName: item.MobName,
                        PlanetName: item.PlanetName,
                        Stab: item.Stab,
                        Cut: item.Cut,
                        Impact: item.Impact,
                        Penetration: item.Penetration,
                        Shrapnel: item.Shrapnel,
                        Burn: item.Burn,
                        Cold: item.Cold,
                        Acid: item.Acid,
                        Electric: item.Electric,
                        Speed: item.Speed,
                        Combat: item.Combat,
                        Movement: item.Movement,
                        Attacks: item.Attacks,
                        Range: item.Range,
                        Aggression: item.Aggression,
                        MinHP: item.MinHP,
                        MinGlobal: item.MinGlobal,
                        Tamable: item.Tamable,
                        Sweatable: item.Sweatable,
                        LootNames: [],
                    };
                }

                if (item.LootNames && item.LootNames.length > 0) {
                    mobDataGrouped[mobNameKey].LootNames.push(...item.LootNames.split(','));
                }
            });

            // Convert the grouped data to an array
            const mobData = Object.values(mobDataGrouped);

            console.log('Processed mobData:', mobData);

            // Initialize DataTable with the combined data
            const dataTable = $('#mobTable').DataTable({
                data: mobData,
                columns: [
                    { data: 'MobName', title: 'Mob Name' },
                    { data: 'PlanetName', title: 'Planet Name' },
                    { data: 'Stab', title: 'Stab' },
                    { data: 'Cut', title: 'Cut' },
                    { data: 'Impact', title: 'Impact' },
                    { data: 'Penetration', title: 'Penetration' },
                    { data: 'Shrapnel', title: 'Shrapnel' },
                    { data: 'Burn', title: 'Burn' },
                    { data: 'Cold', title: 'Cold' },
                    { data: 'Acid', title: 'Acid' },
                    { data: 'Electric', title: 'Electric' },
                    { data: 'Speed', title: 'Speed' },
                    { data: 'Combat', title: 'Combat' },
                    { data: 'Movement', title: 'Movement' },
                    { data: 'Attacks', title: 'Attacks' },
                    { data: 'Range', title: 'Range' },
                    { data: 'Aggression', title: 'Aggression' },
                    { data: 'MinHP', title: 'Min HP' },
                    { data: 'MinGlobal', title: 'Min Global' },
                    { data: 'Tamable', title: 'Tamable' },
                    { data: 'Sweatable', title: 'Sweatable' },
                    {
                        data: null,
                        title: 'View Drops',
                        render: function (data, type, row) {
                            return '<a href="#" class="view-link">View Drops</a>';
                        }
                    }
                ],
                paging: true,
                responsive: true,
                scrollCollapse: true,
                scrollY: '50vh',
                scrollX: true,
                autoWidth: false,
                ordering: true,
                pagingType: "full",
                dom: '<"top"f>rt<"bottom"lip><"clear">',
                lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
                pageLength: 20,
            });

            // Handle row click event to populate the modal content
            $('#mobTable tbody').on('click', 'tr', function () {
                const data = dataTable.row(this).data();
                const lootContent = data.LootNames.length ? data.LootNames.join('<br>') : 'No drops';
                $('#expandModalBody').html(lootContent);

                // Show the modal
                $('#expandModal').modal('show');
            });

            // Handle link click event to open modal
            $('#mobTable tbody').on('click', 'td a.view-link', function (e) {
                e.preventDefault();
                const data = dataTable.row($(this).closest('tr')).data();
                const lootContent = data.LootNames.length ? data.LootNames.join('<br>') : 'No drops';

                // Show the modal using Bootstrap's show() method
                $('#expandModal').modal('show');
            });

            // Add checkboxes for column visibility
            $('#checkboxContainer').html('<label class="checkbox-label">Toggle Columns:</label>');
            dataTable.columns().every(function () {
                const column = this;
                const columnIndex = column.index();
                $('#checkboxContainer').append('<input type="checkbox" checked data-column="' + columnIndex + '">' + column.header().innerHTML);
            });

            // Handle checkbox change event
            $('#checkboxContainer input[type="checkbox"]').on('change', function () {
                const columnIndex = $(this).data('column');
                dataTable.column(columnIndex).visible(!dataTable.column(columnIndex).visible());
            });
        },
        error: function (error) {
            console.error('Error fetching all data:', error);
        }
    });
});
