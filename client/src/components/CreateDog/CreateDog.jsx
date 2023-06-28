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
    console.log();
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
        <button className={style.btn} type="submit" disabled={!isObjectEmpty(errors)}>¡Crear 🐶!</button>
      </form>
    </div>
  );
};