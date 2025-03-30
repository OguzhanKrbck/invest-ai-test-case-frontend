import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import styles from '@/styles/UserDetail.module.css';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/context/ThemeContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function UserDetail() {
  const router = useRouter();
  const { id } = router.query;
  const userId = parseInt(id);
  
  const [allBooks, setAllBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState({
    present: [],
    past: [],
  });
  const [mounted, setMounted] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [returningBookId, setReturningBookId] = useState(null);
  const [showScoreDialog, setShowScoreDialog] = useState(false);
  const [activeBook, setActiveBook] = useState(null);
  const [selectedScore, setSelectedScore] = useState(5);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const fetchUserBooks = async () => {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    
    const userData = {
      "id": data?.payload?.id,  
      "email": data?.payload?.email,
      "name": data?.payload?.name,
      "memberSince": new Date(data?.payload?.createdAt).toLocaleDateString('tr-TR'),
      "image": data?.payload?.image  
    };
    
    setUser(userData);
    setBooks(data?.payload?.books);
  };

  const fetchAllBooks = async () => {
    const response = await fetch('/api/books');
    const data = await response.json();
    setAllBooks(data?.payload);
  };

  useEffect(() => {
    fetchAllBooks();
  }, []);

  useEffect(() => {
    if (id) fetchUserBooks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); 

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleReturnClick = (borrowInfo) => {
    setActiveBook(borrowInfo);
    setSelectedScore();
    setShowScoreDialog(true);
  };

  const closeDialog = () => {
    setShowScoreDialog(false);
    setActiveBook(null);
  };

  const confirmReturn = () => {
    if (activeBook) {
      returnBook(activeBook.bookId, selectedScore);
      closeDialog();
      setShowSuccessDialog(true);
    }
  };

  const returnBook = async (bookId, score) => {
    try {
      setIsReturning(true);
      
      const response = await fetch(`/api/users/${userId}/return/${bookId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          score: score
        }),
      });
      
      const data = await response.json();
      if (data.statusCode) {
        fetchUserBooks();
      } else {
        alert('An error occurred while returning the book: ' + data.message);
      }
    } catch (error) {
      console.error('Book return error:', error);
      alert('An error occurred while returning the book.');
    } finally {
      setIsReturning(false);
      setReturningBookId(null);
    }
  };

  const closeSuccessDialog = () => {
    setShowSuccessDialog(false);
  };
  
  if (!mounted || !user) {
    return <div className={styles.loading}>Loading...</div>;
  }
  
  return (
    <>
      <Head>
        <title>{user.name} - User Details</title>
        <meta name="description" content={`${user.name} user information`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${styles.container} ${geistSans.variable} ${geistMono.variable}`}>
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Return to Home Page
          </Link>
          <h1 className={styles.title}>User Details</h1>
          <div className={styles.headerRight}>
            <ThemeToggle />
          </div>
        </header>
        
        <div className={styles.profile}>
          <div className={styles.profileImage}>
            <Image 
              src={user.image} 
              alt={`${user.name} profil fotoğrafı`} 
              width={120} 
              height={120}
              className={styles.avatar}
            />
          </div>
          <div className={styles.profileInfo}>
            <h2>{user.name}</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Membership Date:</strong> {user.memberSince}</p>
          </div>
        </div>
        
        <div className={styles.bookSections}>
          <section className={styles.section}>
            <h3>Currently Borrowed Books</h3>
            {books?.present?.length > 0 ? (
              <div className={styles.bookGrid}>
                {books?.present?.map(borrowInfo => (
                  <div className={styles.bookCardWrapper} key={borrowInfo.id}>
                    <Link href={`/books/${borrowInfo.bookId}?userId=${userId}`}>
                      <div className={styles.bookCard}>
                        <div className={styles.bookCoverContainer}>
                          <Image 
                            src={borrowInfo.book.coverImage} 
                            alt={`${borrowInfo.book.name} kapak resmi`} 
                            width={100} 
                            height={150}
                            className={styles.bookCover}
                          />
                        </div>
                        <div className={styles.bookInfo}>
                          <h4>{borrowInfo.book.name}</h4>
                          <p>{borrowInfo.book.author}</p>
                          <p className={styles.borrowInfo}>
                            <small>Borrowed At: {new Date(borrowInfo.borrowedAt).toLocaleDateString('tr-TR')}</small>
                          </p>
                        </div>
                      </div>
                    </Link>
                    <button 
                      className={styles.returnButton}
                      onClick={(e) => {
                        e.preventDefault();
                        handleReturnClick(borrowInfo);
                      }}
                      disabled={isReturning && returningBookId === borrowInfo.id}
                      title="Return"
                    >
                      {isReturning && returningBookId === borrowInfo.id ? 'Returning...' : 'Return'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyMessage}>No books currently borrowed.</p>
            )}
          </section>
          
          <section className={styles.section}>
            <h3>Previously Borrowed Books</h3>
            {books?.past?.length > 0 ? (
              <div className={styles.bookGrid}>
                {books?.past?.map(borrowInfo => (
                  <Link href={`/books/${borrowInfo.bookId}?userId=${userId}`} key={borrowInfo.id}>
                    <div className={styles.bookCard}>
                      <div className={styles.bookCoverContainer}>
                        <Image 
                          src={borrowInfo.book.coverImage} 
                          alt={`${borrowInfo.book.name} kapak resmi`} 
                          width={100} 
                          height={150}
                          className={styles.bookCover}
                        />
                      </div>
                      <div className={styles.bookInfo}>
                        <h4>{borrowInfo.book.name}</h4>
                        <p>{borrowInfo.book.author}</p>
                        <div className={styles.borrowDetails}>
                          <p className={styles.borrowDates}>
                            <small>
                              Borrowed: {new Date(borrowInfo.borrowedAt).toLocaleDateString('tr-TR')}
                              <br />
                              Returned: {new Date(borrowInfo.returnedAt).toLocaleDateString('tr-TR')}
                            </small>
                          </p>
                          {borrowInfo.score && (
                            <p className={styles.scoreInfo}>
                              <span className={styles.score}>Score: {borrowInfo.score}/10</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className={styles.emptyMessage}>No previously borrowed books.</p>
            )}
          </section>
          
          <section className={styles.section}>
            <h3>All Books</h3>
            <div className={styles.bookGrid}>
              {allBooks?.map(book => (
                <Link href={`/books/${book.id}?userId=${userId}`} key={book.id}>
                  <div className={styles.bookCard}>
                    <div className={styles.bookCoverContainer}>
                      <Image 
                        src={book.coverImage} 
                        alt={`${book.title} kapak resmi`} 
                        width={100} 
                        height={150}
                        className={styles.bookCover}
                      />
                    </div>
                    <div className={styles.bookInfo}>
                      <h4>{book.name}</h4>
                      <p>{book.author}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
        
        {/* Puanlama Dialog Ekranı */}
        {showScoreDialog && activeBook && (
          <div className={styles.dialogOverlay}>
            <div className={styles.dialogContent}>
              <h3>Rate Book</h3>
              <p><strong>{activeBook.book.name}</strong> You are about to return this book.</p>
              <p>Please rate this book:</p>
              
              <div className={styles.scoreSelector}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                  <button
                    key={score}
                    className={`${styles.scoreButton} ${selectedScore === score ? styles.selectedScore : ''}`}
                    onClick={() => setSelectedScore(score)}
                  >
                    {score}
                  </button>
                ))}
              </div>
              
              <div className={styles.dialogActions}>
                <button 
                  className={styles.cancelButton} 
                  onClick={closeDialog}
                >
                  Cancel
                </button>
                <button 
                  disabled={!selectedScore || isReturning}
                  className={styles.confirmButton} 
                  onClick={confirmReturn}
                >
                  Return
                </button>
              </div>
            </div>
          </div>
        )}
        
        {showSuccessDialog && (
          <div className={styles.dialogOverlay}>
            <div className={styles.dialogContent}>
              <h3>Operation Successful</h3>
              <p>Book has been returned successfully.</p>
              
              <div className={styles.dialogActions}>
                <button 
                  className={styles.confirmButton} 
                  onClick={closeSuccessDialog}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 