import "./App.css";
import { useUserVerification } from "./Components/auth/utils/authUlits";

function App() {

  const users: any = useUserVerification();
  console.log(users)
  return <>
  <h1>Home page (app)</h1></>;
}

export default App;
