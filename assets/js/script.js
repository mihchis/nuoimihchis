// Main Script for Nuôi Mihchis

// 1. Scroll Animations (Moved from index.html)
document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.innerWidth <= 768;

    if (!isMobile) {
        window.addEventListener('scroll', function () {
            const cards = document.querySelectorAll('.feature-card');
            cards.forEach(card => {
                const cardPosition = card.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.3;
                if (cardPosition < screenPosition) {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }
            });
        });

        document.querySelectorAll('.feature-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s ease';
        });
    } else {
        document.querySelectorAll('.feature-card').forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'none';
        });
    }

    // Initialize other features
    initDarkMode();
    initChart();
    initConfetti();
    initNotifications();
    initMusic();
    initLeaderboard();
});

// 2. Dark Mode
function initDarkMode() {
    const toggleBtn = document.getElementById('darkModeToggle');
    if (!toggleBtn) return;

    // Check saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        toggleBtn.textContent = '☀️';
    }

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        toggleBtn.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// 3. Chart.js (Budget)
let budgetChart; // Store instance

function initChart() {
    const ctx = document.getElementById('budgetChart');
    if (!ctx) return;

    // Hide the old list if chart exists
    const budgetList = document.querySelector('.budget-list-container');
    if (budgetList) budgetList.style.display = 'none';

    // Get current language or default to 'vi'
    const lang = localStorage.getItem('preferredLang') || 'vi';
    // Access global translations object if available, otherwise fallback
    const t = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang] : {
        budgetLabel1: 'Ăn uống (40%)',
        budgetLabel2: 'Điện nước (20%)',
        budgetLabel3: 'Thuê nhà (15%)',
        budgetLabel4: 'Y tế (10%)',
        budgetLabel5: 'Học tập (10%)',
        budgetLabel6: 'Giải trí (5%)',
        budgetDatasetLabel: 'Chi tiêu'
    };

    budgetChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [t.budgetLabel1, t.budgetLabel2, t.budgetLabel3, t.budgetLabel4, t.budgetLabel5, t.budgetLabel6],
            datasets: [{
                label: t.budgetDatasetLabel,
                data: [40, 20, 15, 10, 10, 5],
                backgroundColor: [
                    '#e74c3c', // Red
                    '#3498db', // Blue
                    '#f1c40f', // Yellow
                    '#2ecc71', // Green
                    '#9b59b6', // Purple
                    '#95a5a6'  // Grey
                ],
                borderWidth: 1,
                borderColor: document.body.classList.contains('dark-mode') ? '#2c3e50' : '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: document.body.classList.contains('dark-mode') ? '#ecf0f1' : '#2c3e50',
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
    });

    // Update chart text color on theme toggle
    document.getElementById('darkModeToggle').addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-mode');
        const textColor = isDark ? '#ecf0f1' : '#2c3e50';
        const borderColor = isDark ? '#2c3e50' : '#fff';

        if (budgetChart) {
            budgetChart.options.plugins.legend.labels.color = textColor;
            budgetChart.data.datasets[0].borderColor = borderColor;
            budgetChart.update();
        }
    });
}

// 4. Confetti
function initConfetti() {
    const donateButtons = document.querySelectorAll('.cta-button');
    donateButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Don't prevent default if it's a link, just fire confetti
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#e74c3c', '#f1c40f', '#2ecc71']
            });
        });
    });
}

// 5. Fake Notifications
function initNotifications() {
    const names = ['Nguyễn Văn A', 'Trần Thị B', 'Mạnh Thường Quân Giấu Tên', 'Người Hâm Mộ', 'Fan Cứng'];
    const amounts = ['20.000đ', '50.000đ', '1 ly trà sữa', '1 gói mì tôm', '100.000đ'];
    const messages = ['Cố lên nhé!', 'Mời bạn ăn sáng', 'Nuôi Mihchis béo mầm', 'Ủng hộ dự án', 'Haha vui quá'];

    const container = document.getElementById('notification-container');
    if (!container) return;

    function showNotification() {
        const name = names[Math.floor(Math.random() * names.length)];
        const amount = amounts[Math.floor(Math.random() * amounts.length)];
        const message = messages[Math.floor(Math.random() * messages.length)];

        const notif = document.createElement('div');
        notif.className = 'fake-notification';
        notif.innerHTML = `
            <div class="notif-icon">💸</div>
            <div class="notif-content">
                <strong>${name}</strong> vừa donate <span>${amount}</span><br>
                <small>"${message}"</small>
            </div>
        `;

        container.appendChild(notif);

        // Remove after animation
        setTimeout(() => {
            notif.remove();
        }, 5000);
    }

    // Start loop
    setInterval(showNotification, 15000 + Math.random() * 10000); // 15-25s
}

// 6. Background Music
function initMusic() {
    const musicBtn = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');

    if (!musicBtn || !bgMusic) return;

    musicBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                musicBtn.textContent = '🔊';
                musicBtn.classList.add('playing');
            }).catch(err => {
                console.log("Audio play failed:", err);
            });
        } else {
            bgMusic.pause();
            musicBtn.textContent = '🔇';
            musicBtn.classList.remove('playing');
        }
    });

    // Optional: Lower volume
    bgMusic.volume = 0.3;
}

// 7. Fake Leaderboard
function initLeaderboard() {
    const container = document.querySelector('.leaderboard-container');
    if (!container) return;

    const topDonors = [
        { name: "Shark Hưng", amount: "5.000.000.000đ", icon: "🦈" },
        { name: "Một người giấu tên", amount: "1 Iphone 15 Pro Max", icon: "📱" },
        { name: "Bà Hàng Xóm", amount: "3 bát phở bò", icon: "🍜" },
        { name: "Người Yêu Cũ", amount: "1.000đ (kèm lời xin lỗi)", icon: "💔" },
        { name: "Fan Cứng 20 năm", amount: "100.000đ", icon: "⭐" }
    ];

    container.innerHTML = topDonors.map((donor, index) => {
        let rankIcon = index + 1;
        let rankClass = `rank-${index + 1}`;
        if (index === 0) rankIcon = "🥇";
        if (index === 1) rankIcon = "🥈";
        if (index === 2) rankIcon = "🥉";

        return `
            <div class="leaderboard-item ${rankClass}">
                <div class="leaderboard-rank">${rankIcon}</div>
                <div class="leaderboard-info">
                    <div class="name">${donor.name} ${donor.icon}</div>
                </div>
                <div class="amount">${donor.amount}</div>
            </div>
        `;
    }).join('');
}
