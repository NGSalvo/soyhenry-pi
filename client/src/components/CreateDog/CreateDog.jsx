import { useState } from "react";
import { useDispatch } from "react-redux";
import { createDog } from "../../redux/actions";
import { validate, isObjectEmpty } from "@utils"
import { TemperamentFilter } from '@components'
import style from './CreateDog.module.css'
import dogBark from "@assets/sounds/single-bark-of-a-dog-38780.mp3";

const initialState = {
  name: "",
  minHeight: 0,
  maxHeight: 0,
  minWeight: 0,
  maxWeight: 0,
  minLifeSpan: 0,
  maxLifeSpan: 0,
  image: 'noDogImage.webp',
  temperament: []
}

export const CreateDog = () => {
  const [form, setForm] = useState(initialState)
  const [errors, setErrors] = useState(initialState)
  const [selectedTemperaments, setSelectedTemperaments] = useState([])
  const [resetSignal, setResetSignal] = useState(false);
  const bark = new Audio(dogBark)

  const dispatch = useDispatch()

  const serializeInput = (inputs) => {
    return {
      name: inputs.name,
      height: {
        min: inputs.minHeight || inputs.maxHeight,
        max: inputs.maxHeight || inputs.minHeight,
      },
      weight: {
        min: inputs.minWeight || inputs.maxWeight,
        max: inputs.maxWeight || inputs.minWeight,
      },
      life_span: {
        min: inputs.minLifeSpan || inputs.maxLifeSpan,
        max: inputs.maxLifeSpan || inputs.minLifeSpan,
      },
      image: inputs.image,
      temperament: selectedTemperaments.map(temperament => temperament.name)
    }
  }

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })

    setErrors(
      validate({...form, [event.target.name]: event.target.value})
    )
  }

  const handleTemperamentChange = (selectedTemperament, currentTemperament) => {
    let localUserSelectedTemperaments = selectedTemperaments
    const hasSelectedTemperament = localUserSelectedTemperaments.includes(currentTemperament)
    
    localUserSelectedTemperaments = hasSelectedTemperament ? localUserSelectedTemperaments.filter(temperament => temperament !== currentTemperament) : localUserSelectedTemperaments.push(currentTemperament)
    
    setSelectedTemperaments(selectedTemperament)

    setForm({
      ...form, 
      temperament: localUserSelectedTemperaments
    })
    setErrors(validate({...form, temperament: localUserSelectedTemperaments}))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const serializeData = serializeInput(form)
    if (!isObjectEmpty(errors)) return
    dispatch(createDog(serializeData))
    bark.play()
    setResetSignal(true)
    clearForm()
  }

  const clearForm = () => {
    setForm(initialState)
    setErrors(initialState)
    setSelectedTemperaments([])
    setTimeout(() => {
      // This is a workaround, I could refactor it as so the parent component has full control over the state of the filter 
      setResetSignal(false);
    }, 100);
  }

 
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name: </label>
        <input type="text" name="name" onChange={handleChange} value={form.name}/>
        {
          errors.name ? <p className={style.error}>{errors.name}</p> : ''
        }

        <div className={style['input-container']}>
          <label htmlFor="minHeight">Min. Height: </label>
          <input type="number" name="minHeight" onChange={handleChange} value={form.minHeight}/>
          <label htmlFor="maxHeight">Max. Height: </label>
          <input type="number" name="maxHeight" onChange={handleChange} value={form.maxHeight}/>
        </div>
        {
          errors.minHeight ? <p className={style.error}>{errors.minHeight}</p> : ''
        }
        {
          errors.maxHeight ? <p className={style.error}>{errors.maxHeight}</p> : ''
        }

        <div className={style['input-container']}>
          <label htmlFor="minWeight">Min. Weight: </label>
          <input type="number" name="minWeight" onChange={handleChange} value={form.minWeight}/>
          <label htmlFor="maxWeight">Max. Weight: </label>
          <input type="number" name="maxWeight" onChange={handleChange} value={form.maxWeight}/>
        </div>
        {
          errors.minWeight ? <p className={style.error}>{errors.minWeight}</p> : ''
        }
        {
          errors.maxWeight ? <p className={style.error}>{errors.maxWeight}</p> : ''
        }
        <div className={style['input-container']}>
        <label htmlFor="minLifeSpan">Min. Life span: </label>
        <input type="number" name="minLifeSpan" onChange={handleChange} value={form.minLifeSpan}/>
        <label htmlFor="maxLifeSpan">Max. Life span: </label>
        <input type="number" name="maxLifeSpan" onChange={handleChange} value={form.maxLifeSpan}/>
        </div>
        {
          errors.minLifeSpan ? <p className={style.error}>{errors.minLifeSpan}</p> : ''
        }

        {
          errors.maxLifeSpan ? <p className={style.error}>{errors.maxLifeSpan}</p> : ''
        }
        <TemperamentFilter onTemperamentChange={handleTemperamentChange} resetSignal={resetSignal}></TemperamentFilter>
        {
          errors.temperament ? <p className={style.error}>{errors.temperament}</p> : ''
        }
        <button className={style.btn} type="submit" disabled={!isObjectEmpty(errors)}>Woof Woof 🐶!</button>
      </form>
      <svg className={[style['svg-background'], style['svg-left']].join(' ')} xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="800" height="800" viewBox="0 0 48.839 48.839">
        <path d="M39.041 36.843c2.054 3.234 3.022 4.951 3.022 6.742 0 3.537-2.627 5.252-6.166 5.252-1.56 0-2.567-.002-5.112-1.326 0 0-1.649-1.509-5.508-1.354-3.895-.154-5.545 1.373-5.545 1.373-2.545 1.323-3.516 1.309-5.074 1.309-3.539 0-6.168-1.713-6.168-5.252 0-1.791.971-3.506 3.024-6.742 0 0 3.881-6.445 7.244-9.477 2.43-2.188 5.973-2.18 5.973-2.18h1.093v-.001s3.698-.009 5.976 2.181c3.259 3.142 7.241 9.476 7.241 9.475zm-22.41-15.965c3.7 0 6.699-4.674 6.699-10.439S20.331 0 16.631 0 9.932 4.674 9.932 10.439s2.999 10.439 6.699 10.439zm-6.42 10.11c2.727-1.259 3.349-5.723 1.388-9.971s-5.761-6.672-8.488-5.414-3.348 5.723-1.388 9.971c1.961 4.248 5.761 6.671 8.488 5.414zm21.995-10.11c3.7 0 6.7-4.674 6.7-10.439S35.906 0 32.206 0s-6.699 4.674-6.699 10.439 2.999 10.439 6.699 10.439zm13.521-5.276c-2.728-1.259-6.527 1.165-8.488 5.414s-1.339 8.713 1.389 9.972c2.728 1.258 6.527-1.166 8.488-5.414s1.339-8.713-1.389-9.972z"/>
      </svg>
      <svg className={[style['svg-background'], style['svg-right']].join(' ')} xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="800" height="800" viewBox="0 0 48.839 48.839">
        <path d="M39.041 36.843c2.054 3.234 3.022 4.951 3.022 6.742 0 3.537-2.627 5.252-6.166 5.252-1.56 0-2.567-.002-5.112-1.326 0 0-1.649-1.509-5.508-1.354-3.895-.154-5.545 1.373-5.545 1.373-2.545 1.323-3.516 1.309-5.074 1.309-3.539 0-6.168-1.713-6.168-5.252 0-1.791.971-3.506 3.024-6.742 0 0 3.881-6.445 7.244-9.477 2.43-2.188 5.973-2.18 5.973-2.18h1.093v-.001s3.698-.009 5.976 2.181c3.259 3.142 7.241 9.476 7.241 9.475zm-22.41-15.965c3.7 0 6.699-4.674 6.699-10.439S20.331 0 16.631 0 9.932 4.674 9.932 10.439s2.999 10.439 6.699 10.439zm-6.42 10.11c2.727-1.259 3.349-5.723 1.388-9.971s-5.761-6.672-8.488-5.414-3.348 5.723-1.388 9.971c1.961 4.248 5.761 6.671 8.488 5.414zm21.995-10.11c3.7 0 6.7-4.674 6.7-10.439S35.906 0 32.206 0s-6.699 4.674-6.699 10.439 2.999 10.439 6.699 10.439zm13.521-5.276c-2.728-1.259-6.527 1.165-8.488 5.414s-1.339 8.713 1.389 9.972c2.728 1.258 6.527-1.166 8.488-5.414s1.339-8.713-1.389-9.972z"/>
      </svg>
    </div>
  );
};