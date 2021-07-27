import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {
  const wordArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const [isCreating, setCreating] = useState<boolean>(false);
  const [code, setCode] = useState<number>();
  const [key12, setKey12] = useState<number>();
  const [key1, setKey1] = useState<number>();
  const [key2, setKey2] = useState<number>();
  const [key3, setKey3] = useState<number>();
  const [answerWord, setAnswerWord] = useState<string>("");
  const [isCreatingWord, setIsCreatingWord] = useState<boolean>(false);
  const answerWordArray :string[] = [];
  const answerWordNumArray :number[] = [];

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
    if(code !== undefined)
      return answerWord.indexOf('undefined') === -1 && answerWord !== createAnswer(code) && answerWordArray.indexOf(answerWord) === -1 ? answerWord : 'undefined';
    else
      return 'undefined'
  }

  const submitCodes = () => {
    if(!(key1 && key2 || key12)){
      alert("鍵1と2の情報が不足しています．");
      setIsCreatingWord(false);
      return;
    }
    const key1Array:Array<number> = [];
    let tempKey1 = 1;
    let tempKey2 = 1;
    if(key12 !== undefined){
      for(tempKey1 = 2; tempKey1**2 < key12; tempKey1++){
        if(key12 % tempKey1 === 0) key1Array.push(tempKey1);
      }
      if(key1Array.length === 1){
        tempKey1 = key1Array[0];
        tempKey2 = key12 / key1Array[0];
      }else{
        alert("素因数分解に失敗しました．鍵1&2は素数2個で構成された合成数になっていますか？");
        setIsCreatingWord(false);
        return;
      }
    }else{
      if(key1 !== undefined && key2 !== undefined){
        let tempNum;
        for (tempNum = 2; tempNum**2 < key1; tempNum++){
          if(key1 % tempNum === 0){
            alert("鍵1は素数ではありません．");
            setIsCreatingWord(false);
            return;
          }
        }
        tempKey1 = key1;
        for (tempNum = 2; tempNum**2 < key2; tempNum++){
          if(key2 % tempNum === 0){
            alert("鍵2は素数ではありません．");
            setIsCreatingWord(false);
            return;
          }
        }
        tempKey2 = key2;
      }
    }
    let m=0, d=0, answerCode=0;
    if(key3 !== undefined){
      m = decideM(key3, tempKey1, tempKey2);
      d = (m*(tempKey1-1)*(tempKey2-1)+1)/key3;
      answerCode = mod(code, d, key12);
      setAnswerWord(createAnswer(answerCode));
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
      let toSetAnswerWord = '';
      for(let i = 0; i < answerWordArray.length; i++){
        toSetAnswerWord += answerWordArray[i] + '(e=' + answerWordNumArray[i] + ')\n'
      }
      setAnswerWord(toSetAnswerWord);
    }
    setIsCreatingWord(false);
    return;
  }

  const startCreate = (e :any) => {
    e.preventDefault();
    setAnswerWord("");
    setIsCreatingWord(true);
  }

  useEffect(()=>{
    if(isCreatingWord)
      submitCodes();
  },[isCreatingWord])

  return (
    <>
      <p className={styles.title}>RSA暗号を解いてみよう/作ってみよう</p>
      <p className={styles.description}>
        <a href="https://quizknock.com/" target="_blank" rel="noreferrer" className={styles.link}>QuizKnock</a>さんが<a href="https://youtu.be/kvC55N4k9ng" target="_blank" rel="noreferrer" className={styles.link}>こちら</a>の動画で解説していたRSA暗号の暗号化・復号化の手順が非常に興味深かったのでパソコンやスマホで実際にRSA暗号を解いたり作ったりできるサイトを作ってみました！<br/>
        友達にRSA暗号を出してみたり，出されたRSA暗号を解くために使ってみたりしよう！<br/>
        <small className={styles.caution}>※注意※　あくまで人間の手で解けるレベルの暗号の暗号化・復号化の補助を目的に作成しております．セキュリティ等に用いられる長さのRSA暗号に対応しておりませんのでご注意ください．</small>
      </p>
      <div className={styles.buttonWrapper}>
        <input className={isCreating?styles.button:styles.buttonSelected} type="button" value="解く" onClick={()=>{setCreating(false)}} />
        <input className={!isCreating?styles.button:styles.buttonSelected} type="button" value="作る" onClick={()=>{setCreating(true)}} />
      </div>
      {
        !isCreating?(
          <>
            <p className={styles.descriptionSmall}>暗号と鍵1,2は必ず入力してください．また，鍵3が入力されていない場合，復号に成功したメッセージを全て表示しています．</p>
            <form className={styles.form} onSubmit={startCreate}>
                <input className={styles.input} type="tel" placeholder="暗号" value={code} onChange={(e) => {setCode(e.target.value.replace(/[^0-9]/g, '')!==''?parseInt(e.target.value.replace(/[^0-9]/g,'')):undefined)}} required />
                <input className={styles.input} type="tel" placeholder="鍵1&2(n)" value={key12} onChange={(e) => {setKey12(e.target.value.replace(/[^0-9]/g, '')!==''?parseInt(e.target.value.replace(/[^0-9]/g,'')):undefined)}} />
                <input className={styles.input} type="tel" placeholder="鍵1(p)" value={key1} onChange={(e) => {setKey1(e.target.value.replace(/[^0-9]/g, '')!==''?parseInt(e.target.value.replace(/[^0-9]/g,'')):undefined)}} />
                <input className={styles.input} type="tel" placeholder="鍵2(q)" value={key2} onChange={(e) => {setKey2(e.target.value.replace(/[^0-9]/g, '')!==''?parseInt(e.target.value.replace(/[^0-9]/g,'')):undefined)}} />
                <input className={styles.input} type="tel" placeholder="鍵3(e)" value={key3} onChange={(e) => {setKey3(e.target.value.replace(/[^0-9]/g, '')!==''?parseInt(e.target.value.replace(/[^0-9]/g,'')):undefined)}} />
                <input className={styles.button} type="submit" value="復号" />
            </form>
            {isCreatingWord?(
              <>
                <h2 className={styles.loading}>解読中…</h2>
              </>
            ):(<></>)}
            <textarea className={styles.answer} value={answerWord} readOnly />
          </>
        ):(
          <>
            <p className={styles.form}>未実装</p>
          </>
        )
      }
      <span className={styles.bottomSpace} />
    </>
  )
}
