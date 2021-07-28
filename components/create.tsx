import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Create() {
  const [isCreating, setIsCreating] = useState();
  const [word, setWord] = useState<string>('');
  const [key1, setKey1] = useState<string>('');
  const [key2, setKey2] = useState<string>('');
  const [key3, setKey3] = useState<string>('');
  const [answerWord, setAnswerWord] = useState<string>('');

  const handleWord = (e :any) => {
    let changedString = e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase();
    setWord(changedString);
  }

  const handleKey1 = (e :any) => {
    let changedString = e.target.value.replace(/[^0-9]/g, '');
    setKey1(changedString);
  }

  const handleKey2 = (e :any) => {
    let changedString = e.target.value.replace(/[^0-9]/g, '');
    setKey2(changedString);
  }

  const handleKey3 = (e :any) => {
    let changedString = e.target.value.replace(/[^0-9]/g, '');
    setKey3(changedString);
  }


  return (
    <>
      <p className={styles.descriptionSmall + ' ' + styles.caution}><small>※　平文は大文字のアルファベットのみに対応しております．</small></p>
      <form className={styles.form} >
          <input className={styles.input} type="tel" placeholder="平文" value={word} onChange={handleWord} required />
          <input className={styles.input} type="tel" placeholder="鍵1(p)" value={key1} onChange={handleKey1} required />
          <input className={styles.input} type="tel" placeholder="鍵2(q)" value={key2} onChange={handleKey2} required />
          <input className={styles.input} type="tel" placeholder="鍵3(e)" value={key3} onChange={handleKey3} required />
          <input className={styles.button} type="submit" value="暗号化" />
      </form>
      {isCreating?(
        <>
          <h2 className={styles.loading}>解読中…</h2>
        </>
      ):(<></>)}
      <textarea className={styles.answer} value={answerWord} readOnly />
    </>
  )
}