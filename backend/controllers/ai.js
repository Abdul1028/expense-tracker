exports.getGptAnalyis = async (req, res) => {
    try {
      const incomes = await Income.find();
      const expenses = await Expense.find();
      const allData = { incomes, expenses };
      let newData = "Income data is: " + JSON.stringify(incomes);
      newData +=
        "Expense data is: " +
        JSON.stringify(allData) +
        "with the above data please help me analyse where are my most expenses are going and where from i am getting more income and give me a brief analysis of the history i've given above";
      // res.send(newData);
      console.log(newData);

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: newData }],
        max_tokens: 200,
      });
      console.log(response);
      res.send(response.choices[0].message.content);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }

  };

  exports.getGeminiAnalysis = async (req, res) => {
    try {
      const incomes = await Income.find();
      const expenses = await Expense.find();
      const allData = { incomes, expenses };
      let newData = "Income data is: " + JSON.stringify(incomes);
      newData +=
        "Expense data is: " +
        JSON.stringify(allData) +
        "with the above data please help me analyse where are my most expenses are going and where from i am getting more income and give me a brief analysis of the history i given above and please";
      // res.send(newData);
      console.log(newData);

      const result = await model.generateContent(newData);
      const response = await result.response;
      const data = response.text();
      console.log(data);
      res.send(data);
    } catch (error) {
      console.error("Error generating content:", error);
    }

  };


  
  exports.textToSpeech = async (req,res) =>{
    try {
        const {prompt} = req.params;
        
        custom_prompt =
          prompt +
          " , with the above given query extract expense title amount and title Note: You will only give the extracted words as answer in format of json like this {retrieved title from query,retrieved amount from query ,retrieved category from query} no explanations and other words would be given in response for an instance if query is 'Add an expense of 50000 in category clubbing titled as Others' then answer would be only {Others, 50000, clubbing} and if in case query doesn't contain this followig listed words like 'add an expense','category','titled' and you think amount is not given respond with you forgot to tell me about the title amount or category please speak again ";
        // console.log(custom_prompt);
        if (!prompt.includes("titled")) {
          console.log("f");
          res.send("matching words missing please speak again!");
        } else {
          const result = await model.generateContent(custom_prompt);
          const response = await result.response;
          const data = response.text();
          console.log(data);
          res.send(data);
        }
      } catch (error) {
        console.error("Error generating content:", error);
      }
  }


