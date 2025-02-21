import { RouterProvider } from "react-router-dom";
import "./App.css";
import root from "./router/root";
import Chatbot from "./Chatbot";
// import ImageAnalyzer from "./ImageAnalyzer";

function App() {
  return (
    <>
      {/* <ImageAnalyzer /> */}
      <RouterProvider router={root} />
      <Chatbot />
    </>
  );
}

export default App;
