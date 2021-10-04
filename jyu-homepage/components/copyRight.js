import pageStyles from '/styles/page.module.scss'

export default function CopyRight(){
    return (
        <>
            <table className={pageStyles.copyRight}>
                <tr>
                    COPYRIGHT © JYU. ALL RIGHTS RESERVED.
                </tr>
            </table>
        </>
    )
}