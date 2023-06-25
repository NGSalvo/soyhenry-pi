import { useState } from "react";
import { useDispatch } from "react-redux";
import { createDog } from "../../redux/actions";
import { validate, isObjectEmpty } from "@utils"
import { TemperamentFilter } from '@components'
import style from './CreateDog.module.css'

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
        <label htmlFor="name">Nombre: </label>
        <input type="text" name="name" onChange={handleChange} value={form.name}/>
        {
          errors.name ? <p>{errors.name}</p> : ''
        }

        <label htmlFor="minHeight">Altura mínima: </label>
        <input type="number" name="minHeight" onChange={handleChange} value={form.minHeight}/>
        {
          errors.minHeight ? <p>{errors.minHeight}</p> : ''
        }

        <label htmlFor="maxHeight">Altura máxima: </label>
        <input type="number" name="maxHeight" onChange={handleChange} value={form.maxHeight}/>
        {
          errors.maxHeight ? <p>{errors.maxHeight}</p> : ''
        }

        <label htmlFor="minWeight">Peso mínima: </label>
        <input type="number" name="minWeight" onChange={handleChange} value={form.minWeight}/>
        {
          errors.minWeight ? <p>{errors.minWeight}</p> : ''
        }

        <label htmlFor="maxWeight">Peso máxima: </label>
        <input type="number" name="maxWeight" onChange={handleChange} value={form.maxWeight}/>
        {
          errors.maxWeight ? <p>{errors.maxWeight}</p> : ''
        }

        <label htmlFor="minLifeSpan">Esperanza de vida mínima: </label>
        <input type="number" name="minLifeSpan" onChange={handleChange} value={form.minLifeSpan}/>
        {
          errors.minLifeSpan ? <p>{errors.minLifeSpan}</p> : ''
        }

        <label htmlFor="maxLifeSpan">Esperanza de vida máxima: </label>
        <input type="number" name="maxLifeSpan" onChange={handleChange} value={form.maxLifeSpan}/>
        {
          errors.maxLifeSpan ? <p>{errors.maxLifeSpan}</p> : ''
        }
        <TemperamentFilter onTemperamentChange={handleTemperamentChange} resetSignal={resetSignal}></TemperamentFilter>
        {
          errors.temperament ? <p>{errors.temperament}</p> : ''
        }
        <button type="submit" disabled={!isObjectEmpty(errors)}>¡Crear 🐶!</button>
      </form>
    </div>
  );
};