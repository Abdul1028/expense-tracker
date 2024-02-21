const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express')
const cors = require('cors');
const {readdirSync} = require('fs')
const app = express()
const OpenAI = require("openai");




require('dotenv').config()

const PORT = process.env.PORT
const openai = new OpenAI({

    apiKey:"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"

})



// 1. Configuration
const api_key = "AIzaSyBDPBNrkI4nOi1cJIOwzTT6XqNynaEY3ic";
const genAI = new GoogleGenerativeAI(api_key);
const generationConfig = { temperature: 0.9, topP: 1, topK: 1, maxOutputTokens: 4096 };

// 2. Initialise Model
const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig });

//middlewares
app.use(express.json())
app.use(cors())

//routes
readdirSync('./routes').map((route) => app.use('/api/v1', require('./routes/' + route)))

const server = () => {

    

    
    app.get('/getResponse',async (req,res)=>{
        const userPrompt = req.body.userPrompt;

        const response = await openai.chat.completions.create({
            model:"gpt-3.5-turbo",
            messages:[{"role":"user","content":userPrompt}],
            max_tokens:50
        })
        console.log(response);
        res.send(response.choices[0].message.content);
    })

    app.get('/getGeminiResponse',async(req,res)=>{

        try {
    
            const prompt = req.body.userPrompt
            custom_prompt = prompt + " , with the above given query extract expense title amount and title Note: You will only give the extracted words as answer in format of json like this {retrieved title from query,retrieved amount from query ,retrieved category from query} no explanations and other words would be given in response for an instance if query is 'Add an expense of 50000 in category clubbing titled as Others' then answer would be only {Others, 50000, clubbing} and if in case query doesn't contain this followig listed words like 'add an expense','category','titled' and you think amount is not given respond with you forgot to tell me about the title amount or category please speak again ";
            // console.log(custom_prompt);

            if (!prompt.includes("titled")){
                console.log("f");
                res.send("matching words missing")     
            }
            else{
            const result = await model.generateContent(custom_prompt);
            const response = await result.response;
            const data = response.text();
            console.log(data);
            res.send(data);
            }
          } catch (error) {
            console.error('Error generating content:', error);
          }

    })



    app.listen(PORT, () => {
        console.log('listening to port:', PORT)
    })

}

server()