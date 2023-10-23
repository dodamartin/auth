import './App.css';
import RegistrationForm from './component/RegistrationForm';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import { Dashboard } from './component/Dashboard';
import PasswordResetForm from './component/PasswordResetForm';
import LoginForm from './component/LoginForm';
import Auth from './component/Auth';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
            <Route path = '/' element = {<Auth />}/>
            <Route path = '/dashboard' element = {<Dashboard/>}/>
            <Route path = '/reset' element = {<PasswordResetForm />}/>
            <Route path = '/login' element = {<LoginForm />}/>
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
