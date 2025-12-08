async function loadTopics() {
    try {
        const res = await fetch("http://localhost:5001/listening/topics");
        const topics = await res.json();
        const container = document.getElementById("topic-container");

        const iconMap = {
            "Tranh tả người": "🎨",
            "Tranh tả vật": "🖼️",
            "Hội thoại ngắn": "💬",
            // Thêm icon khác nếu cần
        };

        container.innerHTML = "";

        topics.forEach(topic => {
            const card = document.createElement("button");
            card.className = "tbi-level-card";
            card.dataset.id = topic.topicId;

            card.innerHTML = `
                <div class="tbi-card-icon">${iconMap[topic.topicName] || "🎧"}</div>
                <p>${topic.topicName}</p>
            `;

            card.addEventListener("click", () => {
                // Bạn có thể thay đổi tham số tùy theo nhu cầu (topicId, level, ...)
                window.location.href = `Listening.html?topicId=${topic.topicId}`;
            });

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Failed to load topics:", error);
        document.getElementById("topic-container").innerHTML = "<p style='text-align:center;color:red;'>Không tải được danh sách chủ đề. Vui lòng thử lại sau.</p>";
    }
}

// Tự động chạy khi trang load xong
document.addEventListener("DOMContentLoaded", loadTopics);