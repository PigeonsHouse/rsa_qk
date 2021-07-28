import { useEffect, useState } from "react";
import styles from '../styles/Home.module.css';

export default function Solve() {
  const [] = useState();
  const wordArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const [code, setCode] = useState<string>('');
  const [key12, setKey12] = useState<string>('');
  const [key1, setKey1] = useState<string>('');
  const [key2, setKey2] = useState<string>('');
  const [key3, setKey3] = useState<string>('');
  const [answerWord, setAnswerWord] = useState<string>('');
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const answerWordArray :string[] = [];
  const answerWordNumArray :number[] = [];

  const handleCode = (e :any) => {
    let changedString = e.target.value.replace(/[^0-9]/g, '');
    setCode(changedString);
  }

  const handleKey12 = (e :any) => {
    let changedString = e.target.value.replace(/[^0-9]/g, '');
    setKey12(changedString);
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

  const decideM = (key:any, tempKey1:number, tempKey2:number) => {
    key = parseInt(key);
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

  const createAnswer = (answerCode :number) => {
    let returnWord = "";
    let calcTempNum = 0;
    for(calcTempNum = answerCode; calcTempNum >= 1; calcTempNum = Math.floor(calcTempNum / 100)){
      returnWord = wordArray[calcTempNum % 100 - 1] + returnWord;
    }
    return returnWord;
  }

  const checkCreateAnswer = (answerCode :number) => {
    let answerWord = createAnswer(answerCode);
    return answerWord.indexOf('undefined') === -1 && answerWord !== createAnswer(parseInt(code)) && answerWordArray.indexOf(answerWord) === -1 ? answerWord : 'undefined';
  }

  const startSolve = (e :any) => {
    e.preventDefault();
    setAnswerWord("");
    setIsSolving(true);
  }

  const SolveCodes = () => {
    if (!code || isNaN(Number(code))) {
      alert("暗号を入力してください．");
      setIsSolving(false);
      return;
    }
    if(!(key1 && key2 || key12) || isNaN(Number(key12)) || isNaN(Number(key1)) || isNaN(Number(key2))){
      alert("鍵1と2の情報が不足しています．");
      setIsSolving(false);
      return;
    }
    if(isNaN(Number(code)) || isNaN(Number(key12)) || isNaN(Number(key1)) || isNaN(Number(key2))){
      alert("数字のみ入力してください．");
      setIsSolving(false);
      return;
    }
    const key1Array:Array<number> = [];
    let tempKey1 = 1;
    let tempKey2 = 1;
    let tempKey12 = 1;
    if(key12 !== ''){
      tempKey12 = parseInt(key12);
      for(tempKey1 = 2; tempKey1**2 < tempKey12; tempKey1++){
        if(tempKey12 % tempKey1 === 0) key1Array.push(tempKey1);
      }
      if(key1Array.length === 1){
        tempKey1 = key1Array[0];
        tempKey2 = tempKey12 / key1Array[0];
      }else{
        alert("素因数分解に失敗しました．鍵1&2は素数2個で構成された合成数になっていますか？");
        setIsSolving(false);
        return;
      }
    }else{
      if(key1 !== '' && key2 !== ''){
        tempKey1 = parseInt(key1);
        let tempNum;
        if(tempKey1 === 1){
          alert("鍵1は素数ではありません．");
          setIsSolving(false);
          return;
        }
        for (tempNum = 2; tempNum**2 <= tempKey1; tempNum++){
          if(tempKey1 % tempNum === 0){
            alert("鍵1は素数ではありません．");
            setIsSolving(false);
            return;
          }
        }
        tempKey2 = parseInt(key2);
        if(tempKey2 === 1){
          alert("鍵2は素数ではありません．");
          setIsSolving(false);
          return;
        }
        for (tempNum = 2; tempNum**2 <= tempKey2; tempNum++){
          if(tempKey2 % tempNum === 0){
            alert("鍵2は素数ではありません．");
            setIsSolving(false);
            return;
          }
        }
      }
    }
    let m=0, d=0, answerCode=0;
    let toSetAnswerWord = '';
    if(key3 !== '' && !isNaN(Number(key3))){
      let tempKey3 = parseInt(key3);
      m = decideM(tempKey3, tempKey1, tempKey2);
      d = (m*(tempKey1-1)*(tempKey2-1)+1)/tempKey3;
      answerCode = mod(code, d, key12);
      toSetAnswerWord = createAnswer(answerCode);
    }else{
      for(let i=1; i<65538; i++){
        m = decideM(i, tempKey1, tempKey2);
        d = (m*(tempKey1-1)*(tempKey2-1)+1)/i;
        answerCode = mod(code, d, key12);
        let AC = checkCreateAnswer(answerCode);
        if(AC !== 'undefined' && AC !== ''){
          answerWordArray.push(AC);
          answerWordNumArray.push(i);
        }
      }
      for(let i = 0; i < answerWordArray.length; i++){
        toSetAnswerWord += answerWordArray[i] + '(e=' + answerWordNumArray[i] + ')\n'
      }
    }
    setAnswerWord(toSetAnswerWord.length>0 ? toSetAnswerWord : '復号できた平文が見つかりませんでした．');
    setIsSolving(false);
    return;
  }

  useEffect(()=>{
    if(isSolving)
      SolveCodes();
  },[isSolving])

	return (
		<>
      <p className={styles.descriptionSmall + ' ' + styles.caution}><small>※　暗号と鍵1,2は必ず入力してください．また，鍵3が入力されていない場合，復号に成功したメッセージを全て表示しています．</small></p>
      <form className={styles.form} onSubmit={startSolve}>
          <input className={styles.input} type="tel" placeholder="暗号" value={code} onChange={handleCode} />
          <input className={styles.input} type="tel" placeholder="鍵1&2(n)" value={key12} onChange={handleKey12} />
          <input className={styles.input} type="tel" placeholder="鍵1(p)" value={key1} onChange={handleKey1} />
          <input className={styles.input} type="tel" placeholder="鍵2(q)" value={key2} onChange={handleKey2} />
          <input className={styles.input} type="tel" placeholder="鍵3(e)" value={key3} onChange={handleKey3} />
          <input className={styles.button} type="submit" value="復号" />
      </form>
      {isSolving?(
        <>
          <h2 className={styles.loading}>解読中…</h2>
        </>
      ):(<></>)}
      <textarea className={styles.answer} value={answerWord} readOnly />
		</>
	)
}