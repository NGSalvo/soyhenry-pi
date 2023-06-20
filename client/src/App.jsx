import { CardDetail, Error, Home, LandingPage, Nav } from "@components";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import './App.css';
import { usePagination } from "./hooks/usePagination";
import { initDogs, searchByName as searchByNameDogs } from "./redux/actions";


// TODO: Refactor pagination to be a wrapper of Cards

function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch()
  const stateDogs = useSelector(state => state.myDogs)


  const itemsPerPage = 8;
  const { currentPage, totalPages, getCurrentItems, navigateToPage } = usePagination(stateDogs, itemsPerPage);
  
  const searchByName = async (name) => {
    try {
      dispatch(searchByNameDogs(name))
    } catch (error) {
      if (error.response.status === 404) return navigate('not-found')
      console.log(error.message)
      return navigate('/home')
    }
  }

  useEffect(() => {
    dispatch(initDogs())
  }, [])
    
  return (
    <div className="App">
      { pathname !== '/' && <Nav onSearch={searchByName}></Nav>}
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/home' element={<Home dogs={getCurrentItems()} currentPage={currentPage} totalPages={totalPages} getCurrentItems={getCurrentItems} navigateToPage={navigateToPage} />}/>
        <Route path='/detail/:id' element={<CardDetail/>}/>
        <Route path='*' element={<Error/>}/>
      </Routes>
    </div>
  );
}

export default App
