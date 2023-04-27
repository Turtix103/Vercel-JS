import { database } from '@/FireBaseConfig';
import { useState } from 'react';
import {getFirestore, addDoc, getDoc, collection} from "@firebase/firestore";

const c = collection(database, 'notes');



export default function Document() {
  const [formError, setFormError] = useState('');
  
  const validateForm = () => {
    if (!textArea1) {
      setFormError('Please enter your first name');
      return false;
    }
    if (!textArea2) {
      setFormError('Please enter your last name');
      return false;
    }
    if (!textArea3 || !/^[0-9]{5}$/.test(textArea3)) {
      setFormError('Please enter a valid 5-digit PSČ');
      return false;
    }
    setFormError('dsad');
    return true;
  }

  const [textArea1, setTextArea1] = useState(''); 
  const [textArea2, setTextArea2] = useState(''); 
  const [textArea3, setTextArea3] = useState(''); 
  const saveRecord = async () => {
    if (validateForm()) {
    try {
      await addDoc(c, {Jméno: textArea1, Příjmení: textArea2, PSČ: textArea3});
    }
    catch (err) {
      console.log(err);
    } }
  }
  return (
    <div>
      <label for="1">Jméno</label>
       <textArea onChange={(event) => {setTextArea1(event.target.value); console.log(event.target.value)}} id="1">{textArea1}</textArea>
       <label for="2">Příjmení</label>
       <textArea onChange={(event) => {setTextArea2(event.target.value); console.log(event.target.value)}} id="2">{textArea2}</textArea>
       <label for="3">PSČ</label>
       <textArea onChange={(event) => {setTextArea3(event.target.value); console.log(event.target.value)}} id="3">{textArea3}</textArea>
       <button onClick={() => saveRecord()}> Pokračovat</button>
    </div>
  )
}
