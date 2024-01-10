// mobTableScript.js

$(document).ready(function () {
    // Fetch all data from the server
    $.ajax({
        url: '/api/allData',
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
                        ID: item.ID,
                        MobName: item.MobName,
                        PlanetName: item.PlanetName,
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
                    { data: 'MobName' },
                    { data: 'PlanetName' },
                    {
                        data: null,
                        render: function (data, type, row) {
                            console.log('LootNames for ' + row.MobName + ':', row.LootNames);
                            return row.LootNames.length
                                ? '<div class="truncated-list" data-bs-toggle="modal" data-bs-target="#expandModal" data-loot="' + row.LootNames.join(', ') + '">' + row.LootNames.join(', ') + '</div>'
                                : 'No drops';
                        }
                    }
                ],
                paging: true,
                autoWidth: true,
                ordering: true,
                pagingType: "full",
                dom: '<"top"f>rt<"bottom"lip><"clear">',
                paging: true,
                lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
                pageLength: 20,
                drawCallback: function (settings) {
                    console.log('Rendered DataTable HTML:', $('#mobTable').html());
                }
            });

            // Handle row click event to populate the modal content
            $('#mobTable tbody').on('click', 'tr', function () {
                const data = dataTable.row(this).data();
                const lootContent = data.LootNames.length ? data.LootNames.join('<br>') : 'No drops';
                $('#expandModalBody').html(lootContent);
            });
        },
        error: function (error) {
            console.error('Error fetching all data:', error);
        }
    });
});
