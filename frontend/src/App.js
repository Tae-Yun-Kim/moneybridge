import { RouterProvider } from "react-router-dom";
import "./App.css";
import root from "./router/root";
// import ChatBot from "./ChatBot";
// import ImageAnalyzer from "./ImageAnalyzer";

function App() {
  return (
    <>
      {/* <ImageAnalyzer /> */}
      <RouterProvider router={root} />
      {/* <ChatBot /> */}
    </>
  );
}

export default App;
