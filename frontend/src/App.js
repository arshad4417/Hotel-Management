import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Home from "./components/Home.js"
import Navbar from "./components/Navbar.js"
import About from "./components/About.js"


function App() {
  return (
   <>
   <Navbar/>
   <Router>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/about" element={<About/>}/>
    </Routes>
   </Router>
   </>
  );
}

export default App;
