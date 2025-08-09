import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import pageStyles from '/styles/page.module.scss';

// firebase
import { initializeApp } from 'firebase/app';
import { getDocs, getFirestore, collection } from 'firebase/firestore';

// Component
import CommentTable from '../components/commentTable';
import sortBookListByTitle from '../components/utils';
import WorkExperience from './workExperiences/workExperience';

import utf8 from 'utf8';

export default function Main() {
    const [bookList, setBookList] = useState(null);
    const [bookPreviewList, setBookPreviewList] = useState(null);
    const [isTextMode, setIsTextMode] = useState(false);
    const [filter, setFilter] = useState('');
    const [isFocus, setFocus] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('좋아하는 것을 불러오고 있습니다.');

    const firebaseConfig = {
        apiKey: 'AIzaSyCrHlHoW4YEe-oU-76H7AEI9RMkBoAX1P0',
        authDomain: 'gyujanggak-99e8a.firebaseapp.com',
        projectId: 'gyujanggak-99e8a',
    };

    let app = null, db = null;

    try {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
    } catch (e) {
        console.error('Error initializing Firebase:', e);
    }

    useEffect(() => {
        const handleScroll = () => {
            setFocus(document.documentElement.scrollTop > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const books = await getDocs(collection(db, 'bookList'));
                const sortedBooks = sortBookListByTitle(books);

                const descList = sortedBooks.map((book) => (
                    <li key={book.data().title}>
                        <Link href={`/book/${book.id}`}>
                            {`${book.data().title} (${book.data().publishDate}, ${book.data().author})`}
                        </Link>
                    </li>
                ));

                const imgList = sortedBooks.map((book) => (
                    <div className={pageStyles.bookImgFrame} key={book.data().title}>
                        <Link href={`/book/${book.id}`}>
                            <a>
                                <img src={book.data().image} alt={book.data().title} />
                                <div>{utf8.decode(book.data().review).slice(0, 40) + '...'}</div>
                            </a>
                        </Link>
                    </div>
                ));

                setBookList(descList);
                setBookPreviewList(imgList);
            } catch (e) {
                console.error('Error fetching books:', e);
            }
        };

        fetchBooks();
    }, [db]);

    useEffect(() => {
        let loadingDot = 0;
        const interval = setInterval(() => {
            setLoadingMessage((prev) => {
                if (loadingDot >= 10) {
                    loadingDot = 0;
                    return '다시 접속해 주세요.^^';
                }
                loadingDot++;
                return prev + '.';
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const renderBookList = () => {
        if (!bookPreviewList) return null;

        const filteredBooks = bookPreviewList.filter((book) =>
            book.props.children.props.children.props.children[0].props.alt
                .toLowerCase()
                .includes(filter.toLowerCase())
        );

        if (filteredBooks.length === 0) {
            if (['chating', 'chat', '채팅', '장용운'].includes(filter.toLowerCase())) {
                return null;
            }
            return <div className={pageStyles.bookImgWaitingText}>"원하는 책이 없네욤"</div>;
        }

        return filteredBooks;
    };

    return (
        <>
            <div
                className={
                    isFocus
                        ? `${pageStyles.comBannerGroup} ${pageStyles.comBannerGroupFocus}`
                        : `${pageStyles.comBannerGroup}`
                }
            >
                <div
                    className={
                        isFocus
                            ? `${pageStyles.comBannerGroupInputGroupFocus}`
                            : `${pageStyles.comBannerGroupInputGroup}`
                    }
                >
                    <div>
                        <label
                            className={
                                isFocus
                                    ? `${pageStyles.comBannerGroupLabel} ${pageStyles.comBannerGroupLabelFocus}`
                                    : `${pageStyles.comBannerGroupLabel}`
                            }
                        >
                            <a href="/workExperiences/workExperience">장용운</a>'s Archive:
                        </label>
                    </div>
                    <div>
                        <input
                            onChange={(e) => setFilter(e.target.value)}
                            className={pageStyles.comBannerGroupInput}
                            placeholder="책 이름, 장용운, 채팅 중 하나를 써보세요"
                        />
                        <span className={pageStyles.comBannerGroupInputBar} />
                    </div>
                </div>
            </div>
            {bookList === null ? (
                <div id="loading" className={pageStyles.bookGroupSectionLoading}>
                    {loadingMessage}
                </div>
            ) : (
                <>
                    <div
                        className={
                            isFocus
                                ? `${pageStyles.bookGroupSection} ${pageStyles.bookGroupSectionFocus}`
                                : `${pageStyles.bookGroupSection}`
                        }
                    >
                        <div className={pageStyles.bookBox}>
                            {isTextMode ? (
                                <ul className={pageStyles.bookTitleList}>
                                    <div>{bookList}</div>
                                </ul>
                            ) : (
                                renderBookList()
                            )}
                        </div>
                        <div className={pageStyles.bookBoxButton}>
                            <button onClick={() => setIsTextMode(!isTextMode)}>
                                {isTextMode ? 'Image mode' : 'Text mode'}
                            </button>
                        </div>
                    </div>
                    <div>
                        {['chating', 'chat', '채팅'].includes(filter.toLowerCase()) && (
                            <CommentTable app={app} section="chats" />
                        )}
                    </div>
                    <div>{filter === '장용운' && <WorkExperience />}</div>
                </>
            )}
        </>
    );
}