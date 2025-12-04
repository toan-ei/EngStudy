async function loadTopics() {
    try {
        const res = await fetch("http://localhost:5001/listening/topics");
        const topics = await res.json();
        const container = document.getElementById("topic-container");
        const iconMap = {
            "Tranh tả người": "🎨",
            "Tranh tả vật": "🖼️",
            "Hội thoại ngắn": "💬"
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
                window.location.href = `Listening.html`;
            });

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Failed to load topics:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadTopics);
