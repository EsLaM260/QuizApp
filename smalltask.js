// Select Elements
let countSpan = document.querySelector(".quiz-info .count span");
let bulletElement = document.querySelector(".bullets");
let bulletSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answer-area");
let submit = document.querySelector(".submit-button");
let theResultContainer = document.querySelector(".results");
let countDownElement = document.querySelector(".countdown");
// Set options
let currentIndex = 0;
let rightAnswer = 0;
let countDownInterval;
function getQuestions() {
    let myReq = new XMLHttpRequest();

    myReq.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionObject = JSON.parse(this.responseText);
            let questionCount = questionObject.length;

            // create bullets and set qustion count
            createBullet(questionCount);

            // Add Data
            addData(questionObject[currentIndex], questionCount);

            // Start CountDown
            countDown(60, questionCount);

            // click on submit
            submit.onclick = () => {
                // Get right answer
                let theRightAnswer = questionObject[currentIndex].right_answer;

                // increase index
                currentIndex++;

                // check answer
                checkAnswer(theRightAnswer);

                // remove previous question
                quizArea.innerHTML = "";
                answerArea.innerHTML = "";


                // Add Data
                addData(questionObject[currentIndex], questionCount);

                // handle bullets class
                handleBullets()

                // Start CountDown
                clearInterval(countDownInterval);
                countDown(60, questionCount);

                // show Result 
                showResult(questionCount);

            };
        }
    }

    myReq.open("GET", "quiz.json", true);
    myReq.send();
}
getQuestions();


function createBullet(num) {
    countSpan.innerHTML = num;
    for (let i = 0; i < num; i++) {
        let theBullet = document.createElement("span");

        // check if it first span
        if (i === 0) {
            theBullet.className = "on";
        }

        // append bullet to main bullet container
        bulletSpanContainer.appendChild(theBullet);
    }
}



function addData(obj , count) {
    if (currentIndex < count) {
        
        // create h2 qustion title
        let qustionTitle = document.createElement("h2");

        // create qustion Text
        let qustionText = document.createTextNode(obj.title);

        // append text to h2
        qustionTitle.appendChild(qustionText);

        // append the h2 to the quiz area
        quizArea.appendChild(qustionTitle);



        // create the answer
        for (let i = 1; i <= 4; i++) {

            // create main answer div
            let mainDiv = document.createElement("div");
            // Add class to main div
            mainDiv.className = "answer";
            // create radio input
            let radioInput = document.createElement("input");

            // Add type + name + Id + dataAttribute
            radioInput.name = "question";
            radioInput.type = "radio";
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];


            // make first option checked

            // if (i === 1) {
            //     radioInput.checked = true;
            // }

            // create label
            let label = document.createElement("label");

            // add for Attribute 
            label.htmlFor = `answer_${i}`;

            // create label text
            let labelText = document.createTextNode(obj[`answer_${i}`]);

            // add the text to label

            label.appendChild(labelText);

            // add input and label to main div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(label);

            // append all div in answer area
            answerArea.appendChild(mainDiv);
        }

    }
}

function checkAnswer(rAnswer) {
    let answers = document.getElementsByName("question");
    let theChosenAnswer;
    for (let i = 0; i < answers.length; i++){

        if (answers[i].checked) {
            theChosenAnswer = answers[i].dataset.answer;
        }
    }
    if (rAnswer === theChosenAnswer) {
        rightAnswer++;
        console.log(rightAnswer)
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);

    arrayOfSpans.forEach((span,index) => {
        if (currentIndex === index) {
            span.className = "on";
        }
    })
}

function showResult(count) {
    let theResult;
    if (currentIndex ===  count) {
        quizArea.remove();
        answerArea.remove();
        submit.remove();
        bulletElement.remove();


        if (rightAnswer > (count / 2) && rightAnswer < count) {
            theResult = `<span class = "good"> Good</span> , ${rightAnswer} From ${count} Is Good`;
        } else if (rightAnswer === count) {
            theResult = `<span class = "perfect"> Perfect</span> , All Answer Is Perfect`;
        } else {
            theResult = `<span class = "bad"> Bad</span> , ${rightAnswer} From ${count}`;
        }

        theResultContainer.innerHTML = theResult;
    }
}

function countDown(duration , count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countDownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}`:minutes
            seconds = seconds < 10 ? `0${seconds}`:seconds


            countDownElement.innerHTML = `${minutes}:${seconds}`;
            if (--duration < 0) {
                clearInterval(countDownInterval);
                submit.click();
            }

        }, 1000);
    }
}