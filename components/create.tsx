import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Create() {
  const wordArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [word, setWord] = useState<string>('');
  const [key1, setKey1] = useState<string>('');
  const [key2, setKey2] = useState<string>('');
  const [key3, setKey3] = useState<string>('');
  const [answerWord, setAnswerWord] = useState<string>('');

  const handleWord = (e :any) => {
    let changedString = e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 8);
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

  const checkPrime = (num :number) => {
    if(num === 1) return false;
    for(let i = 2; i**2 <= num; i++){
      if(num % i === 0) return false;
    }
    return true;
  }

  const makePlainText = (word :string) => {
    let tempChar :string;
    let tempWord :string = word;
    let returnWord :string = '';
    while(tempWord.length > 0){
      tempChar = tempWord.slice(-1);
      tempWord = tempWord.slice(0, -1);
      for(let i = 0; i < wordArray.length; i++){
        if(tempChar === wordArray[i]){
          let addNumber :string = ('0'+(i+1).toString()).slice(-2);
          returnWord = addNumber + returnWord;
          break;
        }
      }
    }
    return Number(returnWord);

  }

  const decideM = (key:number, tempKey1:number, tempKey2:number) => {
    const firstMod = (tempKey1-1)*(tempKey2-1)%key;
    const secondMod = 2*(tempKey1-1)*(tempKey2-1)%key;
    if(firstMod === key-1) return 1;
    if(secondMod === key-1) return 2;
    let delta = firstMod - secondMod;
    let i;
    for(i = 2; i < key; i++){
      let test = (key+firstMod-(delta*i))%key;
      if(test === key-1) return i+1;
    }
    return 0;
  }

  const mod = (c :any, d :any, n :any) => {
    let i = 0;
    let ret = 1;
    for(i = 0; i < d; i++){
      ret *= c;
      ret %= n;
    }
    return ret;
  }

  const startCreate = (e :any) => {
    e.preventDefault();
    setAnswerWord('');
    setIsCreating(true);
  }

  const CreateCodes = () => {
    let tempKey1 :number = Number(key1);
    let tempKey2 :number = Number(key2);
    let tempKey3 :number = Number(key3);
    let tempKey12 :number = tempKey1 * tempKey2;
    if(tempKey1 === tempKey2){
      alert('鍵1と鍵2が同じ値になっています．')
    }
    if(!checkPrime(tempKey1)){
      alert('鍵1が素数になっていません．');
      setIsCreating(false);
      return;
    }
    if(!checkPrime(tempKey2)){
      alert('鍵2が素数になっていません．');
      setIsCreating(false);
      return;
    }
    if(!checkPrime(tempKey3)){
      alert('鍵3が素数になっていません．');
      setIsCreating(false);
      return;
    }

    let plainText :number = makePlainText(word);
    if(plainText >= tempKey12){
      let criterion :number = Math.ceil(Math.sqrt(plainText));
      alert('鍵1,2の数値が小さすぎます．この2つの積が' + plainText.toString() + '以上になるよう設定してください．鍵1,2の目安は' + criterion.toString() + 'です．');
      setIsCreating(false);
      return;
    }
    
    let m = decideM(tempKey3, tempKey1, tempKey2);
    let d = (m*(tempKey1-1)*(tempKey2-1)+1)/tempKey3;

    let code;
    for(code = 1; code < tempKey12; code++){
      console.log(mod(code, d, tempKey12));
      if(plainText === mod(code, d, tempKey12)){
        let tempAnswerWord :string = code.toString() + 'e' + tempKey12.toString() + ' (e=' + tempKey3 + ')'
        setAnswerWord(tempAnswerWord);
        setIsCreating(false);
        return;
      }
    }
    alert('暗号化に失敗しました．鍵1~3の値を調整してみてください．');
    setIsCreating(false);
    return;
  }

  useEffect(()=>{
    if(isCreating){
      CreateCodes();
    }
  }, [isCreating])

  return (
    <>
      <p className={styles.descriptionSmall + ' ' + styles.caution}><small>※　平文は最大8文字の大文字のアルファベットのみに対応しております．鍵1と鍵2は異なる素数にしてください．また，平文が長ければ長いほど生成に時間がかかり，最悪ブラウザがクラッシュする可能性があります．おすすめは3桁以下です．</small></p>
      <form className={styles.form} onSubmit={startCreate}>
          <input className={styles.input} type="text" placeholder="平文" value={word} onChange={handleWord} required />
          <input className={styles.input} type="tel" placeholder="鍵1(p)" value={key1} onChange={handleKey1} required />
          <input className={styles.input} type="tel" placeholder="鍵2(q)" value={key2} onChange={handleKey2} required />
          <input className={styles.input} type="tel" placeholder="鍵3(e)" value={key3} onChange={handleKey3} required />
          <input className={styles.button} type="submit" value="暗号化" />
      </form>
      {isCreating?(
        <>
          <h2 className={styles.loading}>暗号化中…</h2>
        </>
      ):(<></>)}
      <textarea className={styles.answer} value={answerWord} readOnly />
    </>
  )
}