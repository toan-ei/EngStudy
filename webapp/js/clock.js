let hours = localStorage.getItem('hours');
let minutes = localStorage.getItem('minutes');
let seconds =localStorage.getItem('seconds');

let elHours = document.getElementById("hours");
let elMinutes = document.getElementById("minutes");
let elSeconds = document.getElementById("seconds");

function stopwatch(){
    seconds++;
    if(seconds >= 60){
        minutes++;
        seconds = 0;
        localStorage.setItem('minutes', minutes);
    }
    if(minutes >= 60){
        hours++;
        minutes = 0;
        localStorage.setItem('hours', hours);
    }
    localStorage.setItem('seconds', seconds);
    updateTime();
    const nowTimeVN = new Date().toLocaleString("vi-VN", {timeZone: "Asia/Ho_Chi_Minh"});
    let timeReset = "";
    for(let i = 0; i < 8; i++){
        timeReset += nowTimeVN[i];
    }
    if(timeReset === "00:00:00"){
        hours = 0;
        minutes = 0;
        seconds = 0;
        localStorage.setItem('hours', hours);
        localStorage.setItem('minutes', minutes);
        localStorage.setItem('seconds', seconds);
    }
}

function updateTime(){
    elHours.textContent = hours.toString().padStart(2, "0");
    elMinutes.textContent = minutes.toString().padStart(2, "0");
    elSeconds.textContent = seconds.toString().padStart(2, "0");
}

setInterval(stopwatch, 1000);