function generateTestResponses() {
    var formId =  FormApp.getActiveForm().getId(); // Replace with your Google Form ID
    var form = FormApp.openById(formId);
    var questions = form.getItems();
    var randomItem = "";
    var totoal=101;
  
  
    for (var i = 0; i < totoal; i++) { // Adjust the number of responses as needed
      var formResponse = form.createResponse();
      var progress = (i + 1) / totoal;
  
      var progressBar = getProgressBar(progress, 30); // 30 is the length of the progress bar
      console.log("Generating response " + (i + 1) + "/" + totoal + " - " + progressBar);
  
      questions.forEach(function (question) {
        var type = question.getType();
          //var choices = question.asMultipleChoiceItem().getChoices();
  
  
        if (type === FormApp.ItemType.MULTIPLE_CHOICE) {
          //console.log(question);
          var choices = question.asMultipleChoiceItem().getChoices();
          //debugger;
          //console.log(question.getTitle());
          if(question.getTitle()=="State your academic year?"){
              var randomChoiceIndex = findRandomChoiceIndex(choices);
              var randomChoiceValue = choices[randomChoiceIndex].getValue();
  
              // Add the multiple choice response to the form response
            formResponse.withItemResponse(question.asMultipleChoiceItem().createResponse(randomChoiceValue));
              //formResponse.withItemResponse(multipleChoiceItem.createResponse(randomChoiceValue));
          }
          else{
            var randomIndex = Math.floor(Math.random() * choices.length);
            formResponse.withItemResponse(question.asMultipleChoiceItem().createResponse(choices[randomIndex].getValue()));
          }
        } else if (type === FormApp.ItemType.TEXT) {
  
          formResponse.withItemResponse(question.asTextItem().createResponse(randomItem));
          //randomItem="";
  
        } else if (type === FormApp.ItemType.LIKERT) {
          var likertSteps = question.asLikertItem().getScaleLabels();
          var randomStepIndex = Math.floor(Math.random() * likertSteps.length);
          formResponse.withItemResponse(question.asLikertItem().createResponse(randomStepIndex + 1));
        } else if (type === FormApp.ItemType.CHECKBOX) {
          var checkboxItems = question.asCheckboxItem().getChoices();
          var randomCheckboxItems = [];
          var numOfCheckboxToCheck = Math.floor(Math.random() * checkboxItems.length) + 1;
  
          for (var j = 0; j < numOfCheckboxToCheck; j++) {
            var randomIndex = Math.floor(Math.random() * checkboxItems.length);
            randomCheckboxItems.push(checkboxItems[randomIndex].getValue());
            checkboxItems.splice(randomIndex, 1);
          }
  
          formResponse.withItemResponse(question.asCheckboxItem().createResponse(randomCheckboxItems));
        } else if (type === FormApp.ItemType.SCALE) {
          var scaleSteps = question.asScaleItem().getLowerBound() + question.asScaleItem().getUpperBound() - 1;
          var randomScaleValue = Math.floor(Math.random() * scaleSteps) + 1;
          formResponse.withItemResponse(question.asScaleItem().createResponse(randomScaleValue));
        } else if (type === FormApp.ItemType.RANKED) {
          var rankItems = question.asRankedItem().getChoices();
          var randomRanks = getUniqueRandomRanks(rankItems.length);
          var rankedResponse = [];
  
          for (var j = 0; j < rankItems.length; j++) {
            rankedResponse.push(rankItems[j].getValue());
          }
  
          // Sort the rankedResponse based on the randomly generated ranks
          rankedResponse.sort(function (a, b) {
            return randomRanks[a] - randomRanks[b];
          });
  
          formResponse.withItemResponse(question.asRankedItem().createResponse(rankedResponse));
        } else{
          generateRandomGrid(form, question, formResponse); ;
        }
        // Add more cases for other types of questions if needed.
      });
  
      formResponse.submit();
      Utilities.sleep(100); // Add a short delay to avoid rate-limiting issues
    }
  
    console.log("Task completed!");
  }
  
  function getProgressBar(progress, length) {
    var completedLength = Math.round(progress * length);
    var progressBar = "[" + "#".repeat(completedLength) + "-".repeat(length - completedLength) + "]";
    return progressBar;
  }
  
  function generateRandomGrid(form, question, formResponse) {
    var gridItem = question.asGridItem();
    var gridRows = gridItem.getRows();
    var gridColumns = [['1', '2', '3', '4'], ['2', '3', '4', '1'], ['3', '4', '1', '2'], ['4', '1', '2', '3']];
    var temp1=0;
    var randomGridResponse = [];
    var rowIndex;
  
    for (var i = 0; i < gridRows.length; i++) {
      rowIndex = i;
      var rowResponse = [];
  
      var randomColIndex = (Math.floor(Math.random() * gridColumns[rowIndex].length));
      temp1=randomColIndex;
  
      var colValue = gridColumns[rowIndex][randomColIndex]; // Get a random column choice for the current row
      var randomChoice = gridRows[rowIndex]+ ": " + colValue;
      rowResponse.push(randomChoice);
  
      randomGridResponse.push(rowResponse);
    }
   
  //debugger;
  formResponse.withItemResponse(question.asGridItem().createResponse(gridColumns[temp1]));
  
  }
  
    
  
  // Function to generate an array of unique random indices for a given length
  function getRandomIndices(length) {
    var indices = [];
  
    // Generate a sequence of indices
    for (var i = 0; i < length; i++) {
      indices.push(i);
    }
  
    // Shuffle the indices randomly
    for (var i = length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = indices[i];
      indices[i] = indices[j];
      indices[j] = temp;
    }
  
    return indices;
  }
  
  function getRandomItemFromArray(arr) {
    var randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }
  
  
  
  function findRandomChoiceIndex(choices) {
    // Define the probabilities for each choice (must sum to 100)
    var choiceProbabilities = [5, 75, 18, 2];
  
    var cumulativeProbability = 0;
    var randomProbability = Math.random() * 100; // Generate a random number between 0 and 100
  
    for (var i = 0; i < choices.length; i++) {
      cumulativeProbability += choiceProbabilities[i];
      if (randomProbability < cumulativeProbability) {
        return i;
      }
    }
  
    // If no index is found, return the last choice index as a fallback
    return choices.length - 1;
  }