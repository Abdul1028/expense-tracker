import React, { useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import useClipboard from "react-use-clipboard";
import "./speechToText.css";

function SpeechToText() {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isCopied, setCopied] = useClipboard(transcript);
  const [isListening, setIsListening] = useState(false);

  // Function to start speech recognition
  const startListening = () => {
    setIsListening(true);
    SpeechRecognition.startListening({ continuous: true });
  };

  async function transcribe(transcript){
    // await axios.post("http://localhost:5000/getGeminiResponse")

    try{
      const apiUrl = "http://127.0.0.1:5000/getGeminiResponse";
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ transcript })

    });

        const data = await response.json();
        return "Rtu: "+data;

    }

    catch(err){
      console.error(err);
    }

    
  }

  // Function to stop speech recognition
  const stopListening = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
    console.log("after stopping: "+transcript);
    transcribe(transcript);

  };

  return (
    <div className="container">
      <h1 className="heading">SpeakToType</h1>
      <h3>
       Speak your transactions here
      </h3>
      <div className="textContainer">
        <p>{transcript}</p>
      </div>
      <div className="btnContainer">
        {/* Start speech recognition on mouse down */}
        <button
          className="btn"
          onMouseDown={startListening}
          onMouseUp={stopListening}
        >
          Hold to Speak
        </button>
        <button className="btn" onClick={resetTranscript}>
          Clear Text
        </button>
        <button className="btn" onClick={setCopied}>
          {isCopied ? "Copied! 👍" : "Copy?"}
        </button>

        <button className="btn" onClick={transcribe(transcript)}>
          Submit
        </button>

      </div>
    </div>
  );
}

export default SpeechToText;
