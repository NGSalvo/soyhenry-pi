import { CardDetail, Error, Home, LandingPage, Nav, CreateDog } from "@components";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import './App.css';
import { usePagination } from "./hooks/usePagination";
import { initDogs, searchByName as searchByNameDogs } from "./redux/actions";


// TODO: Refactor pagination to be a wrapper of components
// TODO: Hacer test en front y back
// TODO: Responsive design
// TODO: Refactor to services to call API
// TODO: refactor to axios because better error handling (error.response.data)
// TODO: Pagination: go to N Page
// FIXME: Pagination when in N page and change filter resulting in less pages, and the current page does not goes down
// TODO: reset form after submit
// TODO: css modules do not isolate the styles. Example, ul li changes on TemperamentFilters, get leaked to others ul li

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
      { pathname !== '/' && <Nav onSearch={searchByName} navigateToPage={navigateToPage}></Nav>}
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/home' element={<Home dogs={getCurrentItems()} currentPage={currentPage} totalPages={totalPages} getCurrentItems={getCurrentItems} navigateToPage={navigateToPage} />}/>
        <Route path='/detail/:id' element={<CardDetail/>}/>
        <Route path="/create" element={<CreateDog/>} />
        <Route path='*' element={<Error/>}/>
      </Routes>
    </div>
  );
}

export default App
