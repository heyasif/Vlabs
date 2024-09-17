function generateRandomData() {
    const chemicals = [
        "Ammonium Persulfate",
        "Caustic Potash",
        "Dimethylaminopropylamino",
        "Mono Ammonium Phosphate",
        "Ferric Nitrate",
        "n-Pentane",
        "Glycol Ether PM",
        "Sodium Hydroxide",
        "Sulfuric Acid",
        "Hydrochloric Acid",
        "Benzene",
        "Methanol",
        "Ethylene Glycol",
        "Acetic Acid",
        "Isopropanol"
    ];

    const vendors = ["LG Chem", "Formosa", "Sinopec", "DowDuPont", "BASF"];
    const packagingTypes = ["Bag", "Barrel", "Container", "Drum"];
    const units = ["kg", "L", "t"];

    const data = [];

    for (let i = 0; i < 15; i++) {
        const randomChemical = chemicals[Math.floor(Math.random() * chemicals.length)];
        const randomVendor = vendors[Math.floor(Math.random() * vendors.length)];
        const randomPackaging = packagingTypes[Math.floor(Math.random() * packagingTypes.length)];
        const randomUnit = units[Math.floor(Math.random() * units.length)];
        
        data.push({
            id: i + 1,
            name: randomChemical,
            vendor: randomVendor,
            density: (Math.random() * (9000 - 1000) + 1000).toFixed(2),
            viscosity: (Math.random() * (100 - 10) + 10).toFixed(2),
            packaging: randomPackaging,
            packSize: (Math.random() * (500 - 50) + 50).toFixed(2),
            unit: randomUnit,
            quantity: (Math.random() * (10000 - 1000) + 1000).toFixed(2),
        });
    }

    return data;
}

let chemicalData = generateRandomData();

function renderTable(data) {
    const tableBody = document.querySelector("#chemical-table tbody");
    tableBody.innerHTML = "";

    data.forEach((chemical, index) => {
        const row = `
            <tr>
                <td>${chemical.id}</td>
                <td contenteditable="true">${chemical.name}</td>
                <td contenteditable="true">${chemical.vendor}</td>
                <td contenteditable="true">${chemical.density}</td>
                <td contenteditable="true">${chemical.viscosity}</td>
                <td contenteditable="true">${chemical.packaging}</td>
                <td contenteditable="true">${chemical.packSize}</td>
                <td contenteditable="true">${chemical.unit}</td>
                <td contenteditable="true">${chemical.quantity}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });

    tableBody.querySelectorAll('td[contenteditable="true"]').forEach(cell => {
        cell.addEventListener('input', function () {
            const rowIndex = cell.parentNode.rowIndex - 1;
            const fieldName = cell.cellIndex;
            const value = cell.textContent;

            switch (fieldName) {
                case 1:
                    chemicalData[rowIndex].name = value;
                    break;
                case 2:
                    chemicalData[rowIndex].vendor = value;
                    break;
                case 3:
                    chemicalData[rowIndex].density = value;
                    break;
                case 4:
                    chemicalData[rowIndex].viscosity = value;
                    break;
                case 5:
                    chemicalData[rowIndex].packaging = value;
                    break;
                case 6:
                    chemicalData[rowIndex].packSize = value;
                    break;
                case 7:
                    chemicalData[rowIndex].unit = value;
                    break;
                case 8:
                    chemicalData[rowIndex].quantity = value;
                    break;
            }
        });
    });
}

renderTable(chemicalData);

document.getElementById('add-row').addEventListener('click', addRow);
document.getElementById('move-row-up').addEventListener('click', moveRowUp);
document.getElementById('move-row-down').addEventListener('click', moveRowDown);
document.getElementById('delete-row').addEventListener('click', deleteRow);
document.getElementById('refresh').addEventListener('click', refreshData);
document.getElementById('export-to-excel').addEventListener('click', exportToExcel);

function addRow() {
    const newRow = {
        id: chemicalData.length + 1,
        name: "New Chemical",
        vendor: "New Vendor",
        density: "0.00",
        viscosity: "0.00",
        packaging: "New Packaging",
        packSize: "0.00",
        unit: "kg",
        quantity: "0.00"
    };
    chemicalData.push(newRow);
    renderTable(chemicalData);
}

function moveRowUp() {
    const selectedRowIndex = getSelectedRowIndex();
    if (selectedRowIndex > 0) {
        [chemicalData[selectedRowIndex], chemicalData[selectedRowIndex - 1]] =
        [chemicalData[selectedRowIndex - 1], chemicalData[selectedRowIndex]];
        renderTable(chemicalData);
        selectRow(selectedRowIndex - 1);
    }
}

function moveRowDown() {
    const selectedRowIndex = getSelectedRowIndex();
    if (selectedRowIndex < chemicalData.length - 1) {
        [chemicalData[selectedRowIndex], chemicalData[selectedRowIndex + 1]] =
        [chemicalData[selectedRowIndex + 1], chemicalData[selectedRowIndex]];
        renderTable(chemicalData);
        selectRow(selectedRowIndex + 1);
    }
}

function deleteRow() {
    const selectedRowIndex = getSelectedRowIndex();
    if (selectedRowIndex > -1) {
        chemicalData.splice(selectedRowIndex, 1);
        renderTable(chemicalData);
    }
}

function getSelectedRowIndex() {
    const selectedRow = document.querySelector("#chemical-table tbody tr.selected");
    return selectedRow ? Array.from(selectedRow.parentNode.children).indexOf(selectedRow) : -1;
}

function refreshData() {
    chemicalData = generateRandomData();
    renderTable(chemicalData);
}

function exportToExcel() {
    const ws = XLSX.utils.json_to_sheet(chemicalData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ChemicalData");
    XLSX.writeFile(wb, "ChemicalData.xlsx");
}

document.querySelector("#chemical-table tbody").addEventListener('click', function (e) {
    if (e.target.tagName === 'TD') {
        const rows = document.querySelectorAll("#chemical-table tbody tr");
        rows.forEach(row => row.classList.remove('selected'));
        e.target.closest('tr').classList.add('selected');
    }
});

function selectRow(index) {
    const rows = document.querySelectorAll("#chemical-table tbody tr");
    rows.forEach(row => row.classList.remove('selected'));
    rows[index].classList.add('selected');
}

document.getElementById('search-input').addEventListener('input', function (e) {
    const searchQuery = e.target.value.toLowerCase();
    const filteredData = chemicalData.filter(chemical => 
        chemical.name.toLowerCase().includes(searchQuery) || 
        chemical.vendor.toLowerCase().includes(searchQuery)
    );
    renderTable(filteredData);
});
