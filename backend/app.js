// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const express = require('express')
// const cors = require('cors');
// const {readdirSync} = require('fs')
// const app = express()
// const OpenAI = require("openai");




// require('dotenv').config()

// const PORT = process.env.PORT
// const openai = new OpenAI({

//     apiKey:"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"

// })



// // 1. Configuration
// const api_key = "AIzaSyBDPBNrkI4nOi1cJIOwzTT6XqNynaEY3ic";
// const genAI = new GoogleGenerativeAI(api_key);
// const generationConfig = { temperature: 0.9, topP: 1, topK: 1, maxOutputTokens: 4096 };

// // 2. Initialise Model
// const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig });

// //middlewares
// app.use(express.json())
// app.use(cors())

// //routes
// readdirSync('./routes').map((route) => app.use('/api/v1', require('./routes/' + route)))

// const server = () => {

    

    
//     app.get('/getResponse',async (req,res)=>{
//         const userPrompt = req.body.userPrompt;

//         const response = await openai.chat.completions.create({
//             model:"gpt-3.5-turbo",
//             messages:[{"role":"user","content":userPrompt}],
//             max_tokens:50
//         })
//         console.log(response);
//         res.send(response.choices[0].message.content);
//     })

//     app.get('/getGeminiResponse',async(req,res)=>{

//         try {
    
//             const prompt = req.body.userPrompt
//             custom_prompt = prompt + " , with the above given query extract expense title amount and title Note: You will only give the extracted words as answer in format of json like this {retrieved title from query,retrieved amount from query ,retrieved category from query} no explanations and other words would be given in response for an instance if query is 'Add an expense of 50000 in category clubbing titled as Others' then answer would be only {Others, 50000, clubbing} and if in case query doesn't contain this followig listed words like 'add an expense','category','titled' and you think amount is not given respond with you forgot to tell me about the title amount or category please speak again ";
//             // console.log(custom_prompt);

//             if (!prompt.includes("titled")){
//                 console.log("f");
//                 res.send("matching words missing")     
//             }
//             else{
//             const result = await model.generateContent(custom_prompt);
//             const response = await result.response;
//             const data = response.text();
//             console.log(data);
//             res.send(data);
//             }
//           } catch (error) {
//             console.error('Error generating content:', error);
//           }

//     })



//     app.listen(PORT, () => {
//         console.log('listening to port:', PORT)
//     })

// }

// server()


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { db } = require("./db/db");
const { readdirSync } = require("fs");
const { Configuration, OpenAIApi } = require("openai");
const app = express();
const axios = require("axios");
const OpenAI = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config();

const PORT = process.env.PORT;

//Open ai instantiation
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 1. Gemini Configuration
const api_key = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(api_key);
const generationConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 5100,
};

// 2. Gemiini Initialise Model
const model = genAI.getGenerativeModel({
  model: "gemini-pro",
  generationConfig,
});

//middlewares
app.use(express.json());
app.use(cors());

//routes
readdirSync("./routes").map((route) =>
  app.use("/api/v1", require("./routes/" + route))
);

const server = () => {
  app.get("/tryGPT", async (req, res) => {
    const userPrompt = req.body.userPrompt;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userPrompt }],
      max_tokens: 50,
    });
    console.log(response);
    res.send(response.choices[0].message.content);
  });

  // app.get("/speechToAttributes", async (req, res) => {
  //   try {
  //     console.log("hit");
  //     const prompt = req.query.userPrompt;
  //     const requiredWords = ["titled", "income", "expense", "category"];
  
  //     // Check if the prompt includes all required words
  //     const hasAllWords = requiredWords.every(word => prompt.includes(word));
  //     if (!hasAllWords) {
  //       console.log("f");
  //       res.send("Matching words missing, please speak again!");
  //       return; // Stop further processing
  //     }
  
  //     const custom_prompt =
  //       prompt +
  //       " , with the above given query extract expense title amount and title Note: You will only give the extracted words as answer in format of json like this {retrieved title from query,retrieved amount from query ,retrieved category from query} no explanations and other words would be given in response for an instance if query is 'Add an expense of 50000 in category clubbing titled as Others' then answer would be only {Others, 50000, clubbing} and if in case query doesn't contain this followig listed words like 'add an expense','category','titled' and you think amount is not given respond with you forgot to tell me about the title amount or category please speak again ";
  
  //     const result = await model.generateContent(custom_prompt);
  //     const response = await result.response;
  //     const data = response.text();
  //     console.log(data);
  //     res.send(data);
  //   } catch (error) {
  //     console.error("Error generating content:", error);
  //     res.status(500).send("Internal Server Error");
  //   }
  // });


  app.get("/speechToAttributes", async (req, res) => {
    try {
      console.log("hit");
      const prompt = req.query.userPrompt;
      const requiredWords = ["titled", "category", "description"];
  
      // Check if either "income" or "expense" is present in the prompt
      const hasIncome = prompt.includes("income");
      const hasExpense = prompt.includes("expense");
      if (hasIncome && hasExpense) {
        res.send("Cannot have both 'income' and 'expense' in the prompt, please speak again!");
        return; // Stop further processing
      }
  
      // Add "income" or "expense" based on the absence of the other
      if (hasIncome || hasExpense) {
        requiredWords.push(hasIncome ? "income" : "expense");
      }

      // if (!hasIncome && !hasExpense){
      //   res.send("It is an expense or income ?")
      // }

      if (!hasIncome && !hasExpense) {
        res.send("Please specify whether it is an income or expense.");
        return; // Stop further processing
      }
      
      
  
      // Check if the prompt includes all required words
      const missingWords = requiredWords.filter(word => !prompt.includes(word));
      if (missingWords.length > 0) {
        console.log("f", missingWords);
        res.send(`Matching words (${missingWords.join(', ')}) missing, please speak again!`);
        return; // Stop further processing
      }

      const custom_prompt =
  prompt +
  " , with the above given query extract expense title amount description and type (income/expense) Note: You will only give the extracted words as an answer in the format of JSON like this {retrieved title from query, retrieved amount from query, retrieved category from query, retrieved description from query, retrieved type from query (income/expense)}. No explanations and other words would be given in the response. For instance, if the query is 'Add an expense of 50000 in category clubbing titled as Others with a description of party', then the answer would be only {Others, 50000, clubbing, party, expense}. If the query doesn't contain the following listed words like 'add an expense', 'category', 'titled', and 'description', or if you think the amount is not given, respond with 'You forgot to tell me about the title, amount, category, description, or type (income/expense). Please speak again.'";


      const result = await model.generateContent(custom_prompt);
      const response = await result.response;
      const data = response.text();
      console.log(data);
      // res.send(data);

      const responseData = data.slice(1, -1).split(', ');

  // Extract data from the parsed array
  const [title, amount, category, description, type] = responseData;

  // Now you can use the extracted data as needed
  console.log('Title:', title);
  console.log('Amount:', amount);
  console.log('Category:', category);
  console.log('Description:', description);
  console.log('Type:', type);

  res.send(responseData)


    } catch (error) {
      console.error("Error generating content:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  


  db();
  app.listen(PORT, () => {
    console.log("listening to port:", PORT);
  });
  app.get("/api/v1", (req, res) => {
    res.send("Adwait says HIII ");
  });

  const Income = require("../backend/models/IncomeModel");
  const Expense = require("../backend//models/ExpenseModel");

  app.get("/getGptAnalysis", async (req, res) => {
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
  });

  app.get("/getGeminiAnalysis", async (req, res) => {
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
  });

  ///this is of no use dont uncomment below part
  // // Set up a route to handle API requests
  // app.get("/openai-api", async (req, res) => {
  //   try {
  //     // Make a request to the OpenAI API
  //     const response = await axios.post(
  //       "https://api.openai.com/v1/completions",
  //       {
  //         prompt: "Once upon a time",
  //         max_tokens: 50,
  //         temperature: 0.7,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: "", // Replace with your OpenAI API key
  //         },
  //       }
  //     );

  //     // Send the response from OpenAI back to the client
  //     res.json(response.data);
  //   } catch (error) {
  //     // Handle errors
  //     console.error("Error calling OpenAI API:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // });
};

server();