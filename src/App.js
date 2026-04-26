import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs-backend-webgl";
import { useState, useEffect, useRef } from "react";


function App() {
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [model, setModel] = useState(null)
  const [imgUrl, setImgUrl] = useState(null)
  const [results, setResults] = useState([])
  const imageRef = useRef()

  const loadModel =async ()=>{
    setIsModelLoading(true)
    try {
      const model = await mobilenet.load()
      setModel(model)
      setIsModelLoading(false)
    } catch (error) {
      console.log(error)
      setIsModelLoading(false)
    }
  }

  const uploadImage = (e) =>{
    const {files} = e.target
    if(files.length >0 ){
      const url = URL.createObjectURL(files[0])
      setImgUrl(url)
    }else{
      setImgUrl(null)
    }
  }

  const identify = async()=>{
    const results = await model.classify(imageRef.current)
    setResults(results)
  }

  useEffect(()=>{
    loadModel()
  },[])

  if(isModelLoading){
    return<div className="loading-screen">
      <h2 className="loading-text">
        Loading
        <span className="dot">.</span>
        <span className="dot">.</span>
        <span className="dot">.</span>
      </h2>
    </div>
  }

  console.log(results)

  return (
    <div className="App">
      <h2 className="header">Image classifier</h2>
      <div className="inputContainer">
        <p>Please upload an image</p>
        <input type="file" accept="image/*" capture='camera' className="uploadImage" onChange={uploadImage}/>
      </div>

      <div className="Wrapper">
        <div className="content">
          <div className="image-list">
              {imgUrl && <img src={imgUrl} alt="Preview" crossOrigin="anonymous" ref={imageRef}/>}
          </div>
          {results.length > 0 && <div className="results-container">
            {results.map((result, index)=>{
              return(
                <div className="result" key={result.className}>
                  <span className="object-name">{result.className}</span>

                   <span className="confidence">
                      Match confidence: {(result.probability * 100).toFixed(2)}%
                      {index === 0 && <span className="best-result"> result</span>}
                    </span>
                </div>
                    )
                    })}
            </div>}
          </div>
        {imgUrl && <button className="id-img" onClick={identify}>Tell me what this is</button>}
      </div>
    </div>
  );
}

export default App;
