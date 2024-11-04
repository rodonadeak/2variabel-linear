let chartInstance; // Menyimpan instance Chart agar bisa dihancurkan nanti

function plotGraph() {
    const input = document.getElementById('equations').value;
    const equations = input.split('\n');
    const datasets = [];
    const ctx = document.getElementById('linearGraph').getContext('2d');

    // Hapus grafik sebelumnya jika ada
    if (chartInstance) {
        chartInstance.destroy();
    }

    let yMax = 0; // Variabel untuk menemukan y maksimum
    let yMin = 0; // Variabel untuk menemukan y minimum

    equations.forEach((eq, index) => {
        const parts = eq.split(/>=|<=|>|</);
        const lhs = parts[0].trim();
        const rhs = parseFloat(parts[1].trim());
        const inequality = eq.match(/>=|<=|>|</);

        const matchX = lhs.match(/([-+]?\d*\.?\d*)x/);
        const matchY = lhs.match(/([-+]?\d*\.?\d*)y/);

        const coefX = matchX ? parseFloat(matchX[1] || '1') : 0;
        const coefY = matchY ? parseFloat(matchY[1] || '1') : 0;

        const yFunction = x => (rhs - coefX * x) / coefY;

        // Data untuk menggambar garis
        const data = [];
        for (let x = 0; x <= 10; x += 0.5) {
            const y = yFunction(x);
            data.push({ x: x, y: y });
            // Update yMax dan yMin berdasarkan titik yang dihasilkan
            if (y > yMax) yMax = y;
            if (y < yMin) yMin = y;
        }

        // Menambahkan garis
        datasets.push({
            label: `Garis ${index + 1}: ${eq}`,
            data: data,
            borderColor: getRandomColor(),
            fill: false,
        });

        // Menggambar area untuk pertidaksamaan
        if (inequality) {
            const areaData = [];
            for (let x = 0; x <= 10; x += 0.5) {
                let yBoundary = yFunction(x);
                let yAreaMin, yAreaMax;

                if (inequality[0] === '<' || inequality[0] === '<=') {
                    yAreaMax = yBoundary;
                    yAreaMin = yMin < 0 ? yMin : 0; // Set minimum area if below zero
                } else if (inequality[0] === '>' || inequality[0] === '>=') {
                    yAreaMin = yBoundary;
                    yAreaMax = yMax; // Set maximum area
                }

                areaData.push({ x: x, y: yAreaMin });
                areaData.push({ x: x, y: yAreaMax });
            }

            datasets.push({
                label: `Area ${index + 1}: ${eq}`,
                data: areaData,
                borderColor: getRandomColor(),
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                fill: true,
            });
        }
    });

    // Tentukan rentang y untuk grafik
    const yRange = Math.ceil(Math.max(Math.abs(yMax), Math.abs(yMin)) * 1.1); // Tambah 10% untuk jarak
    const xRange = 10; // Rentang x tetap 0-10

    // Buat instance baru dari Chart dan simpan ke chartInstance
    chartInstance = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: 0,
                    max: xRange
                },
                y: {
                    type: 'linear',
                    position: 'bottom',
                    min: 0,
                    max: yRange
                }
            }
        }
    });
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
