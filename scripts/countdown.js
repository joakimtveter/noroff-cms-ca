function countdownTimer() {
    const daysElement = document.querySelector('.timer.days');
    const hoursElement = document.querySelector('.timer.hrs');
    const minutesElement = document.querySelector('.timer.min');
    const secondsElement = document.querySelector('.timer.sec');
    const target = new Date('2022-10-30T07:00:00').getTime();
    const now = new Date().getTime();
    const remaining = target - now;

    if (remaining > 0) {
        let days = Math.floor(remaining / (1000 * 60 * 60 * 24));
        let hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((remaining % (1000 * 60)) / 1000);

        daysElement.innerHTML = days >= 10 ? days : `0${days}`;
        hoursElement.innerHTML = hours >= 10 ? hours : `0${hours}`;
        minutesElement.innerHTML = minutes >= 10 ? minutes : `0${minutes}`;
        secondsElement.innerHTML = seconds >= 10 ? seconds : `0${seconds}`;
    } else {
        document.querySelector(
            '.jumotron__subheading'
        ).innerHTML = `<a class="btn btn-primary" href="/games.html">Find a game</a>`;
        document.querySelector('.countdown').remove();
    }
}

setInterval(countdownTimer, 1000);
