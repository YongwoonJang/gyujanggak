
import {useRef} from 'react';

export default function CommentTable(){
    return (
        <>
         {/* 댓글 기능 */}
            {/* <div>
                <div className={pageStyles.Comments}>
                    Comments
                </div>
                <table ref={commentTableRef} className={pageStyles.CommentsTable}>
                    <tbody>
                        {parse(lines)}
                    </tbody>
                </table>
            </div>
            <div className={pageStyles.RegForm}>
                <form onSubmit={regDelComment}>
                    <div className={pageStyles.RegComment}>
                        <div ref={editCommentBox} className={pageStyles.RegCommentBox}>
                            <textarea id="comment" placeholder={defaultContents} onChange={handleContentsChange} />
                        </div>
                        <div ref={editorBox} className={pageStyles.AuthorBox}>
                            <input id="author" placeholder={defaultAuthor} onChange={handleAuthorChange} />
                        </div>
                        <div ref={regButton} className={pageStyles.RegButtonBox}>
                            <button type="submit">게시  하기</button>
                        </div>
                        <div ref={delButton} className={pageStyles.DelButtonBox}>
                            <button type="submit">삭제  하기</button>
                        </div>
                    </div>
                    <div ref={delDocIdRef} style={{ display: "none" }}></div>
                </form>
            </div> */}
        </>
    )

}