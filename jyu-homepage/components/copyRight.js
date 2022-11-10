import pageStyles from '/styles/page.module.scss'

export default function CopyRight(){
    return (
        <>
            <table className={pageStyles.copyRight}>
                <tbody>
                    <tr>
                        <td>COPYRIGHT © JYU. ALL RIGHTS RESERVED.</td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}