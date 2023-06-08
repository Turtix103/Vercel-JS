import { useState } from 'react';
import { getFirestore, addDoc, getDoc, collection, query, where, getDocs, } from '@firebase/firestore';
import { database } from '@/FireBaseConfig';
import styles from '../styles/button.module.css';

const c = collection(database, 'notes');

export default function Document() {
  const [formError, setFormError] = useState('');
  const [textArea1, setTextArea1] = useState('');
  const [textArea2, setTextArea2] = useState('');
  const [textArea3, setTextArea3] = useState('');

  const validateForm = () => {
    if (!textArea1) {
      setFormError('Prosím zadejte jméno');
      return false;
    }
    if (!textArea2) {
      setFormError('Prosím zadejte příjmení');
      return false;
    }
    if (!textArea3 || !/^[0-9]{5}$/.test(textArea3)) {
      setFormError('Prosím zadejte validní pěticiferné číslo PSČ');
      return false;
    }
    setFormError('');
    return true;
  };

  const saveRecord = async () => {
    if (validateForm()) {
      const q = query(c, where('Jméno', '==', textArea1), where('Příjmení', '==', textArea2), where('PSČ', '==', textArea3));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size > 0) {
        setFormError('Záznam již existuje v databázi');
        return;
      }

      try {
        await addDoc(c, { Jméno: textArea1, Příjmení: textArea2, PSČ: textArea3, id: 10 });
      
        // Save inputs in local storage
        localStorage.setItem('textArea1', textArea1);
        localStorage.setItem('textArea2', textArea2);
        localStorage.setItem('textArea3', textArea3);
      
        window.location.href = '/secondStep';
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="1" className={styles.label}>Jméno</label>
          <textarea
            onChange={(event) => {
              setTextArea1(event.target.value);
              console.log(event.target.value);
            }}
            id="1"
            className={styles.textarea}
            value={textArea1}
          />
        </div>
  
        <div className={styles.formGroup}>
          <label htmlFor="2" className={styles.label}>Příjmení</label>
          <textarea
            onChange={(event) => {
              setTextArea2(event.target.value);
              console.log(event.target.value);
            }}
            id="2"
            className={styles.textarea}
            value={textArea2}
          />
        </div>
  
        <div className={styles.formGroup}>
          <label htmlFor="3" className={styles.label}>PSČ</label>
          <textarea
            onChange={(event) => {
              setTextArea3(event.target.value);
              console.log(event.target.value);
            }}
            id="3"
            className={styles.textarea}
            value={textArea3}
          />
        </div>
  
        <button className={styles.button} onClick={() => saveRecord()}>
          Pokračovat
        </button>
  
        {formError && <p className={styles.p}>{formError}</p>}
      </div>
    </div>
  );
}