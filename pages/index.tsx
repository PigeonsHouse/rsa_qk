import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Solve from '../components/solve';
import Create from '../components/create';

export default function Home() {
  const [isSolving, setIsSolving] = useState<boolean>(true);

  return (
    <>
      <Head>
        <title>RSA暗号を解いてみよう/作ってみよう</title>
      </Head>
      <p className={styles.title}>RSA暗号を解いてみよう/作ってみよう</p>
      <p className={styles.description}>
        <a href="https://quizknock.com/" target="_blank" rel="noreferrer" className={styles.link}>QuizKnock</a>さんが<a href="https://youtu.be/kvC55N4k9ng" target="_blank" rel="noreferrer" className={styles.link}>こちら</a>の動画で解説していたRSA暗号の復号の手順が非常に興味深かったので，動画で紹介されていた方法でパソコンやスマホで実際にRSA暗号を解いたり作ったりできるサイトを作ってみました！<br/>
        友達にRSA暗号を出してみたり，出されたRSA暗号を解くために使ってみたりしよう！<br/>
        <small className={styles.caution}>※注意※　あくまで人間の手で解けるレベルの暗号の暗号化・復号の補助を目的に作成しております．セキュリティ等に用いられる長さのRSA暗号に対応しておりませんのでご注意ください．</small>
      </p>
      <div className={styles.buttonWrapper}>
        <input className={isSolving?styles.buttonSelected:styles.button} type="button" value="解く" onClick={()=>{setIsSolving(true)}} />
        <input className={isSolving?styles.button:styles.buttonSelected} type="button" value="作る" onClick={()=>{setIsSolving(false)}} />
      </div>
      {
        isSolving?(
          <Solve />
        ):(
          <Create />
        )
      }
      <span className={styles.bottomSpace} />
    </>
  )
}
