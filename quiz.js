var pos = 0, test, test_status, question, choice, choices, chA, chB, chC, res = 0;
var q1_value = 0; 
var q2_value = 0;
const answers = [];
const fakeURL = "https://mocki.io/v1/5ad6a20f-56a5-47a2-829a-6c6505c73ecf"
var data;
var title;
var description;
var posterURL;

var questions = [
  {
    question: "1. How is the entity on the right panel relevant to the query?",
    answers: {
      a: "Excellent", b: "Good", c: "Poor"},
    triggerOption: "Excellent",
    values: {
      a: 100, b: 50, c: 0
    }
  },
  {
    question: "2. Which parts of content are relevant to the query?",
    answers: {
      a: "Image", b: "Name", c: "Description"},
    values: {
      a: 50, b: 50, c: 25
    }
  }
];

function add_img() {
  var img = document.createElement('img');
  img.src = posterURL;
  document.getElementById('poster').appendChild(img);
}

async function getData(url) {
  const response = await fetch(url);
  var data = await response.json();
  JSON.stringify(data);
  console.log(data);
  title = data.name;
  console.log(data.Description);
  description = data.Description;
  posterURL = data.poster;

  document.getElementById("query").innerHTML = title;
  document.getElementById("name").innerHTML = title;
  document.getElementById("description").innerHTML = description;
  add_img(); 
}

function get(x){
  return document.getElementById(x);
}

function onlyOne(checkbox) {
  var checkboxes = document.getElementsByName('choices')
  checkboxes.forEach((item) => {
      if (item !== checkbox) item.checked = false
  })
} 

function renderQuestion(){

  console.log(pos);

  if(pos >= questions.length){
    pos = 0;
    sum = 0;
    
    return false;
  }

  if (pos == 0) test = get("quiz1");
  else test = get("quiz2");

  
  question = questions[pos].question;
  chA = questions[pos].answers.a;
  chB = questions[pos].answers.b;
  chC = questions[pos].answers.c;


  test.innerHTML = "<h3>"+question+"</h3>";

  if (pos == 0)
  {
    test.innerHTML += "<label> <input type='checkbox' name='choices' value='a' onclick='onlyOne(this)'> "+chA+"</label><br><br>";
    test.innerHTML += "<label> <input type='checkbox' name='choices' value='b' onclick='onlyOne(this)'> "+chB+"</label><br><br>";
    test.innerHTML += "<label> <input type='checkbox' name='choices' value='c' onclick='onlyOne(this)'> "+chC+"</label><br><br><br>";
  }
  else {
    test.innerHTML += "<label> <input type='checkbox' name='choices' value='a'> "+chA+"</label><br><br>";
    test.innerHTML += "<label> <input type='checkbox' name='choices' value='b'> "+chB+"</label><br><br>";
    test.innerHTML += "<label> <input type='checkbox' name='choices' value='c'> "+chC+"</label><br><br><br>";
  }
}

function checkAnswer(){

  choices = document.getElementsByName("choices");
  if (choices.length < 1) {
    return false;
  }  
  console.log(choices[0].checked);

  let i=0;
  if (pos > 0) i += 3;
  
  for(i; i<choices.length; i++){
    let score = 0;
    if(choices[i].checked){
      var choice = choices[i].value;

      if (choice == 'a')  score = questions[pos].values.a;
      else if (choice == 'b') score = questions[pos].values.b;
      else score = questions[pos].values.c;
      console.log(score);

      if (pos == 0) q1_value += score;
      else if (pos == 1) q2_value += score;

      answers.push(choice);
      console.log(answers)
    }
  }
  console.log(q1_value, q2_value);
  
  // validation checkpoint 1.
  if (pos == 0 && !q1_value && !(choices[2].value == 'c')) {
    alert("Answer Question(s)");
    load();
    return false;
  }
  if (pos > 0 && q1_value && !q2_value) {
    alert("Answer Question(s)");
    load();
    return false;
  } 

  // validation checkpoint 3.
  res = q1_value + q2_value;
  console.log(res);

  pos++;

  // validation checkpoint 2
  if (res === 100) {
    renderQuestion();
    return true;
  }
  // sendToServer API call
  sendToServer(res);
}

function sendToServer(res) {
  alert(`Submitted the sum of q1_value ${q1_value} and q2_value ${q2_value}: ${res}`);
  console.log("Sum of q1_value and q2_value: ", res);
  fetch('https://api.sendtoserver/sum', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    authorization: ''  //jwt token???
  },
  body: {
    sum: res,
  }
})
  .then(response => {
    console.log(response)
  })
  .catch(err => {
    console.log(err)
  })
}

function reLoad() {
  window.location.reload("Refresh")
}

function load() {
  window.addEventListener("load", renderQuestion, getData(fakeURL));
}

load();


