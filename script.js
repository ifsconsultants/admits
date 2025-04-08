document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Google Sheets ID and sheet names
    const SHEET_ID = '2PACX-1vRj7bWF5DE2Lnq6FbKm9iUdeiLX0FR3Ptpke20P34nkQh4h6De_sLdCDeEVM9MkvjwUU14A71yu2mv3';
    const SHEET_2024 = 'Fall 2024';
    const SHEET_2025 = 'Fall 2025';
    
    // Function to fetch data from Google Sheets using JSONP
    function fetchSheetData(sheetName, callback) {
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
        const script = document.createElement('script');
        script.src = url + '&callback=' + callback.name;
        document.body.appendChild(script);
        document.body.removeChild(script);
    }
    
    // Callback for 2024 data
    function process2024Data(response) {
        const data = parseSheetData(response);
        populateTable('table2024', data);
    }
    
    // Callback for 2025 data
    function process2025Data(response) {
        const data = parseSheetData(response);
        populateTable('table2025', data);
    }
    
    // Parse Google Sheets response
    function parseSheetData(response) {
        const data = [];
        if (!response || !response.table || !response.table.rows) return data;
        
        response.table.rows.forEach((row, index) => {
            // Skip header row if needed
            if (index === 0) return;
            
            const rowData = [];
            if (row.c) {
                row.c.forEach(cell => {
                    rowData.push(cell ? (cell.v || '') : '');
                });
            }
            data.push(rowData);
        });
        
        return data;
    }
    
    // Function to populate table with data
    function populateTable(tableId, data) {
        const tableBody = document.querySelector(`#${tableId} tbody`);
        tableBody.innerHTML = '';
        
        data.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
        
        // Initialize filtering for this table
        initTableFiltering(tableId);
    }
    
    // Function to initialize table filtering
    function initTableFiltering(tableId) {
        const table = document.getElementById(tableId);
        const filterInputs = document.querySelectorAll(`#${tableId.replace('table', 'fall')} .filter-input`);
        
        filterInputs.forEach(input => {
            input.addEventListener('keyup', function() {
                const columnIndex = parseInt(this.getAttribute('data-column'));
                const filterValue = this.value.toLowerCase();
                
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const cell = row.querySelector(`td:nth-child(${columnIndex + 1})`);
                    if (cell) {
                        const cellValue = cell.textContent.toLowerCase();
                        if (cellValue.includes(filterValue)) {
                            row.style.display = '';
                        } else {
                            row.style.display = 'none';
                        }
                    }
                });
            });
        });
    }
    
    // Load data from Google Sheets
    fetchSheetData(SHEET_2024, process2024Data);
    fetchSheetData(SHEET_2025, process2025Data);
});
