... first 91 lines hidden ...
      .talk-details .description {
          margin-bottom: 1rem;
      }
      .categories {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
      }
      .category-tag {
          background-color: #d6eaff;
          color: #0a2540;
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 500;
      }
      .break-item .time-slot {
          background-color: #d6eaff;
      }
      .break-item .talk-details h2 {
          color: #555;
      }
</style>
`;

const js = `
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const searchInput = document.getElementById('category-search');
        const talkItems = document.querySelectorAll('.schedule-item[data-categories]');

        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase();
            
            talkItems.forEach(item => {
                const categories = item.getAttribute('data-categories').toLowerCase();
                if (categories.includes(searchTerm)) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
</script>
`;

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function generateScheduleHtml() {
    let scheduleHtml = '';
    const startTime = new Date();
    startTime.setHours(10, 0, 0, 0);

    let currentTime = new Date(startTime);

    talks.forEach((talk, index) => {
        const talkStartTime = new Date(currentTime);
        const talkEndTime = new Date(talkStartTime.getTime() + talk.duration * 60000);

        scheduleHtml += `
            <div class="schedule-item" data-categories="${talk.category.join(',').toLowerCase()}">
                <div class="time-slot">
                    <span>${formatTime(talkStartTime)}</span>
                    <span>-</span>
                    <span>${formatTime(talkEndTime)}</span>
                </div>
                <div class="talk-details">
                    <h2>${talk.title}</h2>
                    <p class="speakers">by ${talk.speakers.join(' & ')}</p>
                    <p class="description">${talk.description}</p>
                    <div class="categories">
                        ${talk.category.map(cat => `<span class="category-tag">${cat}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;

        currentTime = new Date(talkEndTime);

        if (index === 2) { // Lunch break after the 3rd talk
            const lunchStartTime = new Date(currentTime);
            const lunchEndTime = new Date(lunchStartTime.getTime() + 60 * 60000);
            scheduleHtml += `
                <div class="schedule-item break-item">
                    <div class="time-slot">
                        <span>${formatTime(lunchStartTime)}</span>
                        <span>-</span>
                        <span>${formatTime(lunchEndTime)}</span>
                    </div>
                    <div class="talk-details">
                        <h2>Lunch Break</h2>
                    </div>
                </div>
            `;
            currentTime = lunchEndTime;
        } else if (index < talks.length - 1) { // Transition break
            currentTime.setMinutes(currentTime.getMinutes() + 10);
        }
    });

    return scheduleHtml;
}

const scheduleHtml = generateScheduleHtml();

let finalHtml = template.replace('', css);
finalHtml = finalHtml.replace('', scheduleHtml);
finalHtml = finalHtml.replace('', js);

fs.writeFileSync(path.join(__dirname, 'index.html'), finalHtml);

console.log('Successfully generated index.html');
