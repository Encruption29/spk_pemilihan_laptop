// =============================================
// DATABASE SIMULATION
// =============================================

let laptops = [
    { id: 1, name: 'ASUS VivoBook 14', price: 7500000, ram: 8, storage: 512, weight: 1.6, usefulness: 7 },
    { id: 2, name: 'Lenovo IdeaPad 3', price: 8200000, ram: 8, storage: 512, weight: 1.8, usefulness: 6 },
    { id: 3, name: 'Acer Swift 3', price: 10500000, ram: 16, storage: 512, weight: 1.2, usefulness: 8 },
    { id: 4, name: 'HP Pavilion 15', price: 11000000, ram: 16, storage: 512, weight: 1.75, usefulness: 7 },
    { id: 5, name: 'MacBook Air M2', price: 18500000, ram: 16, storage: 512, weight: 1.24, usefulness: 9 },
    { id: 6, name: 'ASUS ROG Strix G15', price: 19500000, ram: 16, storage: 1024, weight: 2.3, usefulness: 9 },
    { id: 7, name: 'Lenovo Legion 5 Pro', price: 22000000, ram: 32, storage: 1024, weight: 2.5, usefulness: 9 },
    { id: 8, name: 'Dell XPS 13', price: 21000000, ram: 16, storage: 512, weight: 1.2, usefulness: 8 },
    { id: 9, name: 'MacBook Pro 14"', price: 28000000, ram: 32, storage: 1024, weight: 1.6, usefulness: 10 },
    { id: 10, name: 'ASUS TUF Gaming', price: 14000000, ram: 16, storage: 512, weight: 2.2, usefulness: 8 },
    { id: 11, name: 'HP Envy x360', price: 15500000, ram: 16, storage: 512, weight: 1.36, usefulness: 8 },
    { id: 12, name: 'Acer Nitro 5', price: 12500000, ram: 8, storage: 512, weight: 2.4, usefulness: 7 },
];

const criteriaWeights = {
    price: 0.30,
    ram: 0.25,
    storage: 0.20,
    weight: 0.10,
    usefulness: 0.15
};

let nextId = 13;

// =============================================
// SAW ALGORITHM - FIXED & COMPLETE
// =============================================

function calculateSAW(userCriteria) {
    const { budget, ram, storage, weight } = userCriteria;

    // 1. Filter laptops berdasarkan kriteria user
    let filtered = laptops.filter(l => {
        return l.price <= budget &&
               l.ram >= ram &&
               l.storage >= storage &&
               l.weight <= weight;
    });

    if (filtered.length === 0) {
        filtered = [...laptops];
    }

    // 2. Cari nilai max/min untuk setiap kriteria
    const maxPrice = Math.max(...filtered.map(l => l.price));
    const minPrice = Math.min(...filtered.map(l => l.price));
    const maxRam = Math.max(...filtered.map(l => l.ram));
    const minRam = Math.min(...filtered.map(l => l.ram));
    const maxStorage = Math.max(...filtered.map(l => l.storage));
    const minStorage = Math.min(...filtered.map(l => l.storage));
    const maxWeight = Math.max(...filtered.map(l => l.weight));
    const minWeight = Math.min(...filtered.map(l => l.weight));
    const maxUsefulness = Math.max(...filtered.map(l => l.usefulness));
    const minUsefulness = Math.min(...filtered.map(l => l.usefulness));

    // 3. Decision Matrix (Matriks Keputusan)
    const decisionMatrix = filtered.map(l => ({
        name: l.name,
        price: l.price,
        ram: l.ram,
        storage: l.storage,
        weight: l.weight,
        usefulness: l.usefulness
    }));

    // 4. Normalisasi Matriks
    const normalized = filtered.map(l => ({
        name: l.name,
        price: l.price / maxPrice,
        ram: l.ram / maxRam,
        storage: l.storage / maxStorage,
        weight: minWeight / l.weight,
        usefulness: l.usefulness / maxUsefulness
    }));

    // 5. Weighted Normalized Matrix & Final Score
    const results = normalized.map((n, idx) => {
        const wPrice = n.price * criteriaWeights.price;
        const wRam = n.ram * criteriaWeights.ram;
        const wStorage = n.storage * criteriaWeights.storage;
        const wWeight = n.weight * criteriaWeights.weight;
        const wUsefulness = n.usefulness * criteriaWeights.usefulness;
        const score = wPrice + wRam + wStorage + wWeight + wUsefulness;

        return {
            name: n.name,
            price: wPrice,
            ram: wRam,
            storage: wStorage,
            weight: wWeight,
            usefulness: wUsefulness,
            score: score,
            rank: idx + 1,
            laptop: filtered[idx]
        };
    });

    // 6. Sort by score descending
    results.sort((a, b) => b.score - a.score);
    results.forEach((r, idx) => { r.rank = idx + 1; });

    return { results, decisionMatrix, normalizedMatrix: normalized };
}

// =============================================
// UI HELPER FUNCTIONS
// =============================================

function updateBudgetDisplay(val) {
    document.getElementById('budgetValue').textContent = 'Rp ' + Number(val).toLocaleString('id-ID');
}

function updateRamDisplay(val) {
    document.getElementById('ramValue').textContent = val + ' GB';
}

function updateStorageDisplay(val) {
    const gb = Number(val);
    document.getElementById('storageValue').textContent = gb >= 1024 ? (gb/1024).toFixed(1) + ' TB' : gb + ' GB';
}

function updateWeightDisplay(val) {
    document.getElementById('weightValue').textContent = val + ' kg';
}

function formatRupiah(num) {
    if (num >= 1000000) {
        return 'Rp ' + (num / 1000000).toFixed(1).replace('.0', '') + 'jt';
    }
    return 'Rp ' + num.toLocaleString('id-ID');
}

function formatFullRupiah(num) {
    return 'Rp ' + num.toLocaleString('id-ID');
}

function showToast(message, type) {
    type = type || 'success';
    var container = document.getElementById('toastContainer');
    var colors = {
        success: 'bg-green-500/90 border-green-400/30',
        error: 'bg-red-500/90 border-red-400/30',
        info: 'bg-primary-500/90 border-primary-400/30'
    };
    var icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    var toast = document.createElement('div');
    toast.className = 'toast flex items-center space-x-3 ' + colors[type] + ' border rounded-xl px-5 py-4 shadow-2xl text-white text-sm font-medium';
    toast.innerHTML = '<i class="fas ' + icons[type] + '"></i><span>' + message + '</span>';
    container.appendChild(toast);
    setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        setTimeout(function() { toast.remove(); }, 400);
    }, 3000);
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function toggleMobileMenu() {
    var menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
}

// =============================================
// NAVIGATION SCROLL EFFECT
// =============================================

var navbar = document.getElementById('navbar');
window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
        navbar.classList.add('bg-surface-950/90', 'backdrop-blur-xl', 'border-b', 'border-white/5');
    } else {
        navbar.classList.remove('bg-surface-950/90', 'backdrop-blur-xl', 'border-b', 'border-white/5');
    }
});

// =============================================
// ★ MAIN CALCULATE FUNCTION ★
// =============================================

function handleCalculate(e) {
    e.preventDefault();

    // Ambil nilai dari form
    var budget = parseInt(document.getElementById('budget').value);
    var ram = parseInt(document.getElementById('ram').value);
    var storage = parseInt(document.getElementById('storage').value);
    var weight = parseFloat(document.getElementById('weight').value);

    // Simulasikan loading
    var btn = document.getElementById('calculateBtn');
    var calcText = document.getElementById('calcText');
    var calcIcon = document.getElementById('calcIcon');
    var calcArrow = document.getElementById('calcArrow');

    btn.disabled = true;
    btn.style.opacity = '0.7';
    calcText.textContent = 'Menghitung...';
    calcIcon.className = '';
    calcIcon.innerHTML = '<div class="loading-spinner" style="width:20px;height:20px;border-width:2px"></div>';
    calcArrow.style.display = 'none';

    setTimeout(function() {
        var userCriteria = { budget: budget, ram: ram, storage: storage, weight: weight };
        var sawResult = calculateSAW(userCriteria);

        // Simpan ke global untuk matrix view
        window._lastResult = sawResult;

        if (sawResult.results.length === 0) {
            showToast('Tidak ada laptop yang memenuhi kriteria. Coba ubah filter Anda.', 'error');
            resetButton();
            return;
        }

        // Tampilkan hasil
        renderResults(sawResult);

        // Tampilkan section hasil
        var hasilSection = document.getElementById('hasil');
        hasilSection.classList.remove('hidden');

        setTimeout(function() {
            scrollToSection('hasil');
        }, 100);

        showToast('Analisis selesai! ' + sawResult.results.length + ' laptop ditemukan.', 'success');
        resetButton();
    }, 1200);

    return false;
}

function resetButton() {
    var btn = document.getElementById('calculateBtn');
    var calcText = document.getElementById('calcText');
    var calcIcon = document.getElementById('calcIcon');
    var calcArrow = document.getElementById('calcArrow');

    btn.disabled = false;
    btn.style.opacity = '1';
    calcText.textContent = 'Hitung & Dapatkan Rekomendasi';
    calcIcon.className = 'fas fa-calculator';
    calcIcon.innerHTML = '';
    calcArrow.style.display = '';
}

// =============================================
// RENDER RESULTS
// =============================================

function renderResults(sawResult) {
    var results = sawResult.results;

    // Top 3 Cards
    var topResults = document.getElementById('topResults');
    var medals = ['🥇', '🥈', '🥉'];
    var bgColors = [
        'from-yellow-500/10 to-yellow-600/5 border-yellow-500/20',
        'from-surface-200/10 to-surface-300/5 border-surface-300/20',
        'from-orange-500/10 to-orange-600/5 border-orange-500/20'
    ];

    var topHTML = '';
    for (var i = 0; i < Math.min(3, results.length); i++) {
        var r = results[i];
        var scorePercent = Math.round(r.score * 100);
        topHTML += '<div class="bg-gradient-to-br ' + bgColors[i] + ' border rounded-2xl p-6 card-hover result-reveal stagger-r' + (i+1) + '">' +
            '<div class="flex items-center justify-between mb-4">' +
                '<span class="text-3xl">' + medals[i] + '</span>' +
                '<span class="text-sm font-semibold text-surface-400">Rank #' + r.rank + '</span>' +
            '</div>' +
            '<h4 class="text-lg font-bold mb-1">' + r.laptop.name + '</h4>' +
            '<p class="text-primary-400 font-mono text-sm mb-4">' + formatFullRupiah(r.laptop.price) + '</p>' +
            '<div class="space-y-2 text-sm text-surface-400 mb-4">' +
                '<div class="flex justify-between"><span>RAM</span><span class="text-white">' + r.laptop.ram + ' GB</span></div>' +
                '<div class="flex justify-between"><span>Storage</span><span class="text-white">' + (r.laptop.storage >= 1024 ? (r.laptop.storage/1024).toFixed(0) + ' TB' : r.laptop.storage + ' GB') + '</span></div>' +
                '<div class="flex justify-between"><span>Berat</span><span class="text-white">' + r.laptop.weight + ' kg</span></div>' +
                '<div class="flex justify-between"><span>Kegunaan</span><span class="text-white">' + r.laptop.usefulness + '/10</span></div>' +
            '</div>' +
            '<div>' +
                '<div class="flex justify-between text-sm mb-1">' +
                    '<span class="text-surface-400">Skor SAW</span>' +
                    '<span class="font-bold gradient-text">' + r.score.toFixed(4) + '</span>' +
                '</div>' +
                '<div class="w-full h-3 bg-surface-800 rounded-full overflow-hidden">' +
                    '<div class="h-full gradient-bg rounded-full score-bar" style="width: 0%" data-width="' + scorePercent + '%"></div>' +
                '</div>' +
            '</div>' +
        '</div>';
    }
    topResults.innerHTML = topHTML;

    // Full Table
    var tbody = document.getElementById('resultsTableBody');
    var tableHTML = '';
    for (var j = 0; j < results.length; j++) {
        var res = results[j];
        var rowClass = j === 0 ? 'bg-primary-500/5' : '';
        var rankClass = '';
        if (j === 0) rankClass = 'gradient-bg text-white';
        else if (j === 1) rankClass = 'bg-surface-200/10 text-surface-200';
        else if (j === 2) rankClass = 'bg-orange-500/10 text-orange-400';
        else rankClass = 'bg-surface-800 text-surface-400';

        tableHTML += '<tr class="border-b border-white/5 hover:bg-white/5 transition-colors ' + rowClass + '">' +
            '<td class="px-6 py-4">' +
                '<span class="inline-flex items-center justify-center w-8 h-8 rounded-full ' + rankClass + ' font-bold text-sm">' + res.rank + '</span>' +
            '</td>' +
            '<td class="px-6 py-4">' +
                '<div class="font-semibold">' + res.laptop.name + '</div>' +
            '</td>' +
            '<td class="px-4 py-4 text-center font-mono text-sm">' + formatRupiah(res.laptop.price) + '</td>' +
            '<td class="px-4 py-4 text-center text-sm">' + res.laptop.ram + ' GB</td>' +
            '<td class="px-4 py-4 text-center text-sm">' + (res.laptop.storage >= 1024 ? (res.laptop.storage/1024).toFixed(0) + ' TB' : res.laptop.storage + ' GB') + '</td>' +
            '<td class="px-4 py-4 text-center text-sm">' + res.laptop.weight + ' kg</td>' +
            '<td class="px-4 py-4 text-center">' +
                '<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ' + (j === 0 ? 'gradient-bg text-white' : 'bg-surface-800 text-primary-400') + '">' +
                    res.score.toFixed(4) +
                '</span>' +
            '</td>' +
        '</tr>';
    }
    tbody.innerHTML = tableHTML;

    // Animate score bars
    setTimeout(function() {
        var bars = document.querySelectorAll('.score-bar');
        for (var k = 0; k < bars.length; k++) {
            bars[k].style.width = bars[k].getAttribute('data-width');
        }
    }, 200);
}

// =============================================
// MATRIX DISPLAY
// =============================================

function showMatrix() {
    var modal = document.getElementById('matrixModal');
    var content = document.getElementById('matrixContent');
    modal.classList.remove('hidden');

    var results = window._lastResult;
    if (!results) {
        content.innerHTML = '<p class="text-center text-surface-400 py-12">Belum ada hasil perhitungan. Silakan lakukan kalkulasi terlebih dahulu.</p>';
        return;
    }

    var criteriaLabels = [
        { key: 'price', label: 'Harga', type: 'benefit', weight: criteriaWeights.price },
        { key: 'ram', label: 'RAM', type: 'benefit', weight: criteriaWeights.ram },
        { key: 'storage', label: 'Storage', type: 'benefit', weight: criteriaWeights.storage },
        { key: 'weight', label: 'Berat', type: 'cost', weight: criteriaWeights.weight },
        { key: 'usefulness', label: 'Kegunaan', type: 'benefit', weight: criteriaWeights.usefulness }
    ];

    var decMatrix = results.decisionMatrix;
    var normMatrix = results.normalizedMatrix;
    var sortedResults = results.results;

    // Build Decision Matrix HTML
    var decHead = '<tr class="bg-surface-800"><th class="px-4 py-3 text-left font-semibold text-surface-400">Alternatif</th>';
    for (var c = 0; c < criteriaLabels.length; c++) {
        decHead += '<th class="px-4 py-3 text-center font-semibold text-surface-400">' + criteriaLabels[c].label +
            ' <span class="text-xs ' + (criteriaLabels[c].type === 'benefit' ? 'text-green-400' : 'text-red-400') + '">(' + criteriaLabels[c].type + ')</span></th>';
    }
    decHead += '</tr>';

    var decBody = '';
    for (var d = 0; d < decMatrix.length; d++) {
        var row = decMatrix[d];
        decBody += '<tr class="border-b border-white/5 hover:bg-white/5">' +
            '<td class="px-4 py-3 font-medium">' + row.name + '</td>' +
            '<td class="px-4 py-3 text-center font-mono">' + row.price.toLocaleString('id-ID') + '</td>' +
            '<td class="px-4 py-3 text-center font-mono">' + row.ram + '</td>' +
            '<td class="px-4 py-3 text-center font-mono">' + row.storage + '</td>' +
            '<td class="px-4 py-3 text-center font-mono">' + row.weight + '</td>' +
            '<td class="px-4 py-3 text-center font-mono">' + row.usefulness + '</td>' +
        '</tr>';
    }

    // Build Normalized Matrix HTML
    var normHead = '<tr class="bg-surface-800"><th class="px-4 py-3 text-left font-semibold text-surface-400">Alternatif</th>';
    for (var c2 = 0; c2 < criteriaLabels.length; c2++) {
        normHead += '<th class="px-4 py-3 text-center font-semibold text-surface-400">' + criteriaLabels[c2].label + '</th>';
    }
    normHead += '</tr>';

    var normBody = '';
    for (var n = 0; n < normMatrix.length; n++) {
        var nrow = normMatrix[n];
        normBody += '<tr class="border-b border-white/5 hover:bg-white/5">' +
            '<td class="px-4 py-3 font-medium">' + nrow.name + '</td>' +
            '<td class="px-4 py-3 text-center font-mono text-primary-300">' + nrow.price.toFixed(4) + '</td>' +
            '<td class="px-4 py-3 text-center font-mono text-primary-300">' + nrow.ram.toFixed(4) + '</td>' +
            '<td class="px-4 py-3 text-center font-mono text-primary-300">' + nrow.storage.toFixed(4) + '</td>' +
            '<td class="px-4 py-3 text-center font-mono text-primary-300">' + nrow.weight.toFixed(4) + '</td>' +
            '<td class="px-4 py-3 text-center font-mono text-primary-300">' + nrow.usefulness.toFixed(4) + '</td>' +
        '</tr>';
    }

    // Build Final Score HTML
    var finalHead = '<tr class="bg-surface-800">' +
        '<th class="px-4 py-3 text-left font-semibold text-surface-400">Rank</th>' +
        '<th class="px-4 py-3 text-left font-semibold text-surface-400">Laptop</th>' +
        '<th class="px-4 py-3 text-center font-semibold text-surface-400">Skor Akhir</th>' +
        '<th class="px-4 py-3 text-center font-semibold text-surface-400">Bar</th>' +
    '</tr>';

    var maxScore = sortedResults[0].score;
    var finalBody = '';
    for (var f = 0; f < sortedResults.length; f++) {
        var frow = sortedResults[f];
        var barWidth = Math.round((frow.score / maxScore) * 100);
        var rankClass = '';
        if (f === 0) rankClass = 'gradient-bg text-white';
        else if (f === 1) rankClass = 'bg-surface-200/10 text-surface-200';
        else if (f === 2) rankClass = 'bg-orange-500/10 text-orange-400';
        else rankClass = 'bg-surface-800 text-surface-400';

        finalBody += '<tr class="border-b border-white/5 hover:bg-white/5 ' + (f === 0 ? 'bg-primary-500/5' : '') + '">' +
            '<td class="px-4 py-3">' +
                '<span class="inline-flex items-center justify-center w-7 h-7 rounded-full ' + rankClass + ' text-xs font-bold">' + frow.rank + '</span>' +
            '</td>' +
            '<td class="px-4 py-3 font-medium">' + frow.name + '</td>' +
            '<td class="px-4 py-3 text-center font-mono font-bold text-accent-400">' + frow.score.toFixed(4) + '</td>' +
            '<td class="px-4 py-3">' +
                '<div class="w-full h-3 bg-surface-800 rounded-full overflow-hidden">' +
                    '<div class="h-full gradient-bg rounded-full" style="width: ' + barWidth + '%"></div>' +
                '</div>' +
            '</td>' +
        '</tr>';
    }

    content.innerHTML =
        '<div class="space-y-8">' +
            '<div>' +
                '<h4 class="text-lg font-bold mb-4 flex items-center space-x-2">' +
                    '<span class="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center text-sm text-primary-400">1</span>' +
                    '<span>Matriks Keputusan (X)</span>' +
                '</h4>' +
                '<div class="overflow-x-auto"><table class="w-full text-sm"><thead>' + decHead + '</thead><tbody>' + decBody + '</tbody></table></div>' +
            '</div>' +
            '<div>' +
                '<h4 class="text-lg font-bold mb-4 flex items-center space-x-2">' +
                    '<span class="w-8 h-8 rounded-lg bg-accent-500/20 flex items-center justify-center text-sm text-accent-400">2</span>' +
                    '<span>Matriks Ternormalisasi (R)</span>' +
                '</h4>' +
                '<div class="p-4 bg-surface-800/50 rounded-xl mb-4">' +
                    '<p class="text-xs text-surface-400">' +
                        '<strong class="text-green-400">Benefit:</strong> r<sub>ij</sub> = x<sub>ij</sub> / max(x<sub>j</sub>) &nbsp;|&nbsp;' +
                        '<strong class="text-red-400">Cost:</strong> r<sub>ij</sub> = min(x<sub>j</sub>) / x<sub>ij</sub>' +
                    '</p>' +
                '</div>' +
                '<div class="overflow-x-auto"><table class="w-full text-sm"><thead>' + normHead + '</thead><tbody>' + normBody + '</tbody></table></div>' +
            '</div>' +
            '<div>' +
                '<h4 class="text-lg font-bold mb-4 flex items-center space-x-2">' +
                    '<span class="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-sm text-green-400">3</span>' +
                    '<span>Skor Akhir & Perankingan</span>' +
                '</h4>' +
                '<div class="overflow-x-auto"><table class="w-full text-sm"><thead>' + finalHead + '</thead><tbody>' + finalBody + '</tbody></table></div>' +
            '</div>' +
        '</div>';
}

function closeMatrix() {
    document.getElementById('matrixModal').classList.add('hidden');
}

// =============================================
// ADMIN FUNCTIONS
// =============================================

function renderAdminTable() {
    var tbody = document.getElementById('adminTableBody');
    document.getElementById('laptopCount').textContent = laptops.length;

    var html = '';
    for (var i = 0; i < laptops.length; i++) {
        var l = laptops[i];
        html += '<tr class="border-b border-white/5 hover:bg-white/5 transition-colors">' +
            '<td class="px-6 py-4 text-sm text-surface-400 font-mono">#' + l.id + '</td>' +
            '<td class="px-6 py-4 font-medium text-sm">' + l.name + '</td>' +
            '<td class="px-4 py-4 text-center font-mono text-sm">' + formatRupiah(l.price) + '</td>' +
            '<td class="px-4 py-4 text-center text-sm">' + l.ram + ' GB</td>' +
            '<td class="px-4 py-4 text-center text-sm">' + (l.storage >= 1024 ? (l.storage/1024).toFixed(0) + ' TB' : l.storage + ' GB') + '</td>' +
            '<td class="px-4 py-4 text-center text-sm">' + l.weight + ' kg</td>' +
            '<td class="px-4 py-4 text-center text-sm">' + l.usefulness + '/10</td>' +
            '<td class="px-6 py-4 text-center">' +
                '<div class="flex items-center justify-center space-x-2">' +
                    '<button onclick="editLaptop(' + l.id + ')" class="p-2 bg-accent-500/10 text-accent-400 rounded-lg hover:bg-accent-500/20 transition-all" title="Edit">' +
                        '<i class="fas fa-edit text-sm"></i>' +
                    '</button>' +
                    '<button onclick="deleteLaptop(' + l.id + ')" class="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all" title="Hapus">' +
                        '<i class="fas fa-trash text-sm"></i>' +
                    '</button>' +
                '</div>' +
            '</td>' +
        '</tr>';
    }
    tbody.innerHTML = html;
}

function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Tambah Laptop Baru';
    document.getElementById('editId').value = '';
    document.getElementById('laptopForm').reset();
    document.getElementById('laptopModal').classList.remove('hidden');
}

function editLaptop(id) {
    var laptop = null;
    for (var i = 0; i < laptops.length; i++) {
        if (laptops[i].id === id) { laptop = laptops[i]; break; }
    }
    if (!laptop) return;

    document.getElementById('modalTitle').textContent = 'Edit Laptop';
    document.getElementById('editId').value = laptop.id;
    document.getElementById('laptopName').value = laptop.name;
    document.getElementById('laptopPrice').value = laptop.price;
    document.getElementById('laptopRam').value = laptop.ram;
    document.getElementById('laptopStorage').value = laptop.storage;
    document.getElementById('laptopWeight').value = laptop.weight;
    document.getElementById('laptopUsefulness').value = laptop.usefulness;
    document.getElementById('laptopModal').classList.remove('hidden');
}

function closeLaptopModal() {
    document.getElementById('laptopModal').classList.add('hidden');
}

function handleSaveLaptop(e) {
    e.preventDefault();
    var editId = document.getElementById('editId').value;
    var data = {
        name: document.getElementById('laptopName').value.trim(),
        price: parseInt(document.getElementById('laptopPrice').value),
        ram: parseInt(document.getElementById('laptopRam').value),
        storage: parseInt(document.getElementById('laptopStorage').value),
        weight: parseFloat(document.getElementById('laptopWeight').value),
        usefulness: parseInt(document.getElementById('laptopUsefulness').value)
    };

    if (editId) {
        var idx = -1;
        for (var i = 0; i < laptops.length; i++) {
            if (laptops[i].id === parseInt(editId)) { idx = i; break; }
        }
        if (idx !== -1) {
            laptops[idx] = Object.assign({}, laptops[idx], data);
            showToast('Laptop "' + data.name + '" berhasil diupdate!', 'success');
        }
    } else {
        data.id = nextId++;
        laptops.push(data);
        showToast('Laptop "' + data.name + '" berhasil ditambahkan!', 'success');
    }

    closeLaptopModal();
    renderAdminTable();
    return false;
}

function deleteLaptop(id) {
    var laptop = null;
    for (var i = 0; i < laptops.length; i++) {
        if (laptops[i].id === id) { laptop = laptops[i]; break; }
    }
    if (!laptop) return;

    if (confirm('Apakah Anda yakin ingin menghapus "' + laptop.name + '"?')) {
        laptops = laptops.filter(function(l) { return l.id !== id; });
        renderAdminTable();
        showToast('Laptop "' + laptop.name + '" berhasil dihapus.', 'info');
    }
}

function exportResults() {
    var results = window._lastResult;
    if (!results || results.results.length === 0) {
        showToast('Belum ada hasil untuk di-export.', 'error');
        return;
    }

    var csv = 'Rank,Nama Laptop,Harga,RAM (GB),Storage (GB),Berat (kg),Kegunaan,Skor SAW\n';
    for (var i = 0; i < results.results.length; i++) {
        var r = results.results[i];
        csv += r.rank + ',"' + r.laptop.name + '",' + r.laptop.price + ',' + r.laptop.ram + ',' + r.laptop.storage + ',' + r.laptop.weight + ',' + r.laptop.usefulness + ',' + r.score.toFixed(4) + '\n';
    }

    var blob = new Blob([csv], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'hasil_spk_laptop.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('File CSV berhasil di-download!', 'success');
}

// =============================================
// INTERSECTION OBSERVER
// =============================================

var observer = new IntersectionObserver(function(entries) {
    for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
            entries[i].target.style.animationPlayState = 'running';
        }
    }
}, { threshold: 0.1 });

document.querySelectorAll('.animate-fadeInUp, .animate-fadeIn, .animate-slideInRight').forEach(function(el) {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
});

// =============================================
// KEYBOARD SHORTCUTS
// =============================================

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeMatrix();
        closeLaptopModal();
    }
});

// =============================================
// INIT
// =============================================

renderAdminTable();
