let countSpan=document.querySelector(".count span");
let bulletsSpanContainer=document.querySelector(".bullets .spans");
let currentIndex=0;
let rightAnswers=0;
let countdownInterval;

let quizArea=document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");


function getQuestions(){
    let myRequest=new XMLHttpRequest();
    myRequest.onreadystatechange=function(){
        if(this.readyState===4 &&this.status===200){
            let questionsObject=JSON.parse(this.responseText);
            let qCount = questionsObject.length;
            createBullets(qCount);
            addQuestionData(questionsObject[currentIndex],qCount);

            countdown(3, qCount);


      submitButton.onclick = () => {
        // Get Right Answer
        let theRightAnswer = questionsObject[currentIndex].right_answer;

        // Increase Index
        
        // Check The Answer
        currentIndex++;
        checkAnswer(theRightAnswer, qCount);  
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestionData(questionsObject[currentIndex], qCount);
        handleBullets();
                // Start CountDown
                clearInterval(countdownInterval);
                countdown(3, qCount);
        showResult(qCount);

            };
            // console.log(this.responseText);
        }
    };
    myRequest.open("GET","html_ques.json",true);
    myRequest.send();
}
getQuestions();

function createBullets(num){
    countSpan.innerHTML=num;

     for(i=0;i<num;i++){

        let theBullet=document.createElement("span");

        if(i==0){
            theBullet.className="on";
        }
        
        bulletsSpanContainer.appendChild(theBullet);


     }

}
function addQuestionData(obj ,count){
    if (currentIndex < count) {

    let questionTitle=document.createElement("h2");
    let questionText=document.createTextNode(obj['title']);
    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);
    for (let i = 1; i <= 4; i++) {
        // Create Main Answer Div
        let mainDiv = document.createElement("div");
        mainDiv.className="answer";
        let radioInput = document.createElement("input");
        radioInput.name="question";
        radioInput.type = "radio";
        radioInput.id = `answer_${i}`;
        radioInput.dataset.answer = obj[`answer_${i}`];
// Create Label
let theLabel = document.createElement("label");

// Add For Attribute
theLabel.htmlFor = `answer_${i}`;

// Create Label Text
let theLabelText = document.createTextNode(obj[`answer_${i}`]);

// Add The Text To Label
theLabel.appendChild(theLabelText);

// Add Input + Label To Main Div
mainDiv.appendChild(radioInput);
mainDiv.appendChild(theLabel);

// Append All Divs To Answers Area
answersArea.appendChild(mainDiv);
    }  
}
}
function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;
  
    for (let i = 0; i < answers.length; i++) {
      if (answers[i].checked) {
        theChoosenAnswer = answers[i].dataset.answer;
      }
    }
    console.log(`Right Answer Is: ${rAnswer}`);
    console.log(`The chosen answer: ${theChoosenAnswer}`);

  
    if (rAnswer === theChoosenAnswer) {
        rightAnswers++;
      }
    }
    function handleBullets() {
        let bulletsSpans = document.querySelectorAll(".bullets .spans span");
        let arrayOfSpans = Array.from(bulletsSpans);
        arrayOfSpans.forEach((span, index) => {
          if (currentIndex === index) {
            span.className = "on";
          }
        });
      }

    function showResult(count){
        let theResults;
        if(currentIndex==count){
         quizArea.remove();
         answersArea.remove();
         submitButton.remove();
         bulletsSpanContainer.remove();
        
        if (rightAnswers > count / 2 && rightAnswers < count) {
         theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
        } else if (rightAnswers === count) {
            theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;}
            else {
                theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
              }
              resultsContainer.innerHTML = theResults;
              resultsContainer.style.padding = "10px";
              resultsContainer.style.backgroundColor = "white";
              resultsContainer.style.marginTop = "10px";
              }
    }

    function countdown(duration, count) {
        if (currentIndex < count) {
          let minutes, seconds;
          countdownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
      
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
      
            countdownElement.innerHTML = `${minutes}:${seconds}`;
      
            if (--duration < 0) {
              clearInterval(countdownInterval);
              submitButton.click();
            }
          }, 1000);
        }
      }