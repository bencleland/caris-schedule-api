html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: "Myriad Pro", Arial, sans-serif;
}

body {
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    position: relative;
}

/* Meeting title under "Meeting with" */
#meetingTitle {
    position: absolute;
    left: 78px;
    top: 170px;
    width: 720px;
    font-size: 40px;
    font-weight: 700;
    color: #0072bc;
}

/* Guest attendee names only */
#guestAttendees {
    position: absolute;
    left: 100px;
    top: 270px;
    width: 520px;
    font-size: 24px;
    color: #000;
    white-space: pre-wrap;
    line-height: 1.25;
}

/* Caris attendee names only */
#carisAttendees {
    position: absolute;
    left: 100px;
    top: 520px;
    width: 520px;
    font-size: 24px;
    color: #000;
    white-space: pre-wrap;
    line-height: 1.25;
}

/* Clock on blue panel */
#clockTime {
    position: absolute;
    right: 70px;
    top: 210px;
    width: 360px;
    text-align: center;
    font-size: 56px;
    color: white;
    font-weight: 800;
}

#clockDate {
    position: absolute;
    right: 70px;
    top: 280px;
    width: 360px;
    text-align: center;
    font-size: 25px;
    color: white;
}

/* Status image */
#statusImage {
    position: absolute;
    left: 780px;
    top: 610px;
    width: 250px;
    height: auto;
}

/* Next meeting inside white card */
#nextTime {
    position: absolute;
    right: 115px;
    top: 455px;
    width: 260px;
    text-align: center;
    font-size: 26px;
    color: #4a4a4a;
    font-weight: 700;
}

#nextTitle {
    position: absolute;
    right: 115px;
    top: 510px;
    width: 260px;
    text-align: center;
    font-size: 20px;
    color: #0072bc;
    line-height: 1.2;
}
