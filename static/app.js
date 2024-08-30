document.getElementById('fileUpload').addEventListener('change', handleFileUpload);
document.getElementById('generateChart').addEventListener('click', generateChart);

let chart = null;
let data = [];

function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const text = e.target.result;
        data = CSVToArray(text);
        populateDropdowns(data);
    };

    reader.readAsText(file);
}

function populateDropdowns(data) {
    const keys = Object.keys(data[0]);
    const xAxisSelect = document.getElementById('xAxis');
    const yAxisSelect = document.getElementById('yAxis');

    xAxisSelect.innerHTML = '';
    yAxisSelect.innerHTML = '';

    keys.forEach(key => {
        xAxisSelect.innerHTML += `<option value="${key}">${key}</option>`;
        yAxisSelect.innerHTML += `<option value="${key}">${key}</option>`;
    });
}

function generateChart() {
    const chartType = document.getElementById('chartType').value;
    const xAxis = document.getElementById('xAxis').value;
    const yAxis = document.getElementById('yAxis').value;

    const labels = data.map(row => row[xAxis]);
    const values = data.map(row => parseFloat(row[yAxis]));

    const ctx = document.getElementById('chart').getContext('2d');

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: `${yAxis} vs ${xAxis}`,
                data: values,
                backgroundColor: 'rgba(26,205,208, 1)',
                borderColor: 'rgba(26, 205, 208, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function CSVToArray(strData, strDelimiter = ",") {
    const objPattern = new RegExp(
        (
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );

    const arrData = [[]];
    let arrMatches = null;

    while (arrMatches = objPattern.exec(strData)) {
        const strMatchedDelimiter = arrMatches[1];
        if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
            arrData.push([]);
        }

        const strMatchedValue = arrMatches[2] ? arrMatches[2].replace(
            new RegExp("\"\"", "g"), "\"") : arrMatches[3];

        arrData[arrData.length - 1].push(strMatchedValue);
    }

    const headers = arrData[0];
    const rows = arrData.slice(1).map(row => {
        return headers.reduce((obj, header, i) => {
            obj[header] = row[i];
            return obj;
        }, {});
    });

    return rows;
}
