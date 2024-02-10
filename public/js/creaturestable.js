$(document).ready(function () {
    const CACHE_KEY = 'mobDataCache';

    // Helper Functions
    function loadMobDataFromCache() {
        const json = localstorage.getItem(CACHE_KEY);
        return json ? JSON.parse(json) : null;
    }

    function saveMobDataToCache(data) {
        localstorage.setItem(CACHE_KEY, JSON.stringify(data));
    }

    // Initialize DataTable
    const dataTable = $('#mobTable').DataTable({
        serverSide: true,
        processing: true,
        ajax: {
            url: '/api/mobs',
            method: 'GET',
            dataType: 'json',
            data: function (data) {
                const cachedData = loadMobDataFromCache();
                if (cachedData) {
                    // Example - you'll need to implement pagination & filtering using cache data
                    data.recordsTotal = cachedData.length;
                    data.recordsFiltered = cachedData.length; // Adjust accordingly
                    data = cachedData.slice(data.start, data.start + data.length);
                } else {
                    data.start = data.start;
                    data.limit = data.length;
                }
                return data;
            },
            dataSrc: function (response) {
                saveMobDataToCache(response.data);
                return response.data;
            }
        },
        columns: [
            { data: 'MobName', title: 'Mob Name' },
            // Include additional columns here, potentially  adding 'visible: false'
        ]
    });

    // Example - Expand row and display additional data
    $('#mobTable').on('click', 'tbody tr', function() {
        const rowData = dataTable.row(this).data();
        // Create & insert a child row and fetch the extra details if needed
    } );
});
