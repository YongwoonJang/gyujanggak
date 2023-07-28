import styles from '/styles/profileTable.module.scss'
import {useRef, useEffect} from 'react'

export default function leaf(props){
    const leaf = useRef(null);

    useEffect(()=>{
        window.addEventListener("scroll", ()=>{
            if(leaf.current != null){
                if(props.phase === 1){
                    
                    leaf.current.style.marginTop =- document.documentElement.scrollTop / (500/(props.speed)) + 'px';

                }else if(props.phase  === 2){
                        if(document.documentElement.scrollTop > 1300){
                            leaf.current.style.marginTop = - (document.documentElement.scrollTop-1300) / (500 / (props.speed)) + 'px';
                        }

                }else if(props.phase === 3){
                        if (document.documentElement.scrollTop > 1500) {
                            leaf.current.style.marginTop = - (document.documentElement.scrollTop - 1500) / (500 / (props.speed)) + 'px';
                        }

                }
                
            }
        })
        
    });

    return(
        <>
            <div className={styles.branch}>
                {props.position==="right"?<div>&nbsp;</div>:""}
                {props.position==="right"?<div className={styles.stem}>&nbsp;</div>:""}
                <div ref={leaf} className={props.position==="right"?`${styles.profileTreeRightLeaf}`:`${styles.profileTreeLeftLeaf}`}>
                        {props.description}
                        {props.img}
                </div>
                {props.position==="left"?<div className={styles.stem}>&nbsp;</div>:""}
                {props.position==="left"?<div>&nbsp;</div>:""}
            </div>
        </>
    )

}