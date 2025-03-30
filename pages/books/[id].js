import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import { useTheme } from '@/context/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';
import styles from '@/styles/BookDetail.module.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function BookDetail() {
  const router = useRouter();
  const { id } = router.query;
  const bookId = parseInt(id);

  const [book, setBook] = useState(null);
  const [mounted, setMounted] = useState(false);
  const userIdFromUrl = router.query.userId ? parseInt(router.query.userId) : null;
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'confirm' veya 'result'
  const [dialogMessage, setDialogMessage] = useState('');

  const fetchBookData = async (bookId) => {
    const response = await fetch(`/api/books/${bookId}`);
    const data = await response.json();
    setBook(data?.payload);
  };

  const handleBorrowClick = () => {
    setDialogType('confirm');
    setDialogMessage(`Are you sure you want to borrow "${book.name}"?`);
    setShowDialog(true);
  };

  const borrowBook = async () => {
    try {
      setShowDialog(false); // Onay dialogunu kapat
      setIsLoading(true);
      
      const response = await fetch(`/api/users/${userIdFromUrl}/borrow/${bookId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        setDialogType('result');
        setDialogMessage('Book successfully borrowed!');
        setShowDialog(true);
        await fetchBookData(bookId); // Kitap verilerini güncelle
      } else {
        const error = await response.json();
        setDialogType('result');
        setDialogMessage(`Error: ${error.message || 'Book could not be borrowed'}`);
        setShowDialog(true);
      }
    } catch (error) {
      console.error('Error during borrowing process:', error);
      setDialogType('result');
      setDialogMessage('An error occurred while borrowing the book.');
      setShowDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(id && !book) fetchBookData(id);
  }, [id, book]);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!book) {
    return <div className={styles.loading}>There is no book with this id</div>;
  }
  
  
  return (
    <>
      <Head>
        <title>{book.name} - Book Details</title>
        <meta name="description" content={`${book.name} book information`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={`${styles.container} ${geistSans.variable} ${geistMono.variable}`}>
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Return to Home Page
          </Link>
          <h1 className={styles.name}>Book Details</h1>
          <div className={styles.headerRight}>
            <ThemeToggle />
          </div>
        </header>
        
        <div className={styles.bookDetail}>
          <div className={styles.bookImage}>
            <Image 
              src={book.coverImage} 
              alt={`${book.name} kapak resmi`} 
              width={300} 
              height={450}
              className={styles.cover}
            />
          </div>
          <div className={styles.bookInfo}>
            <h2 className={styles.bookTitle}>{book.name}</h2>
            <div className={styles.bookMeta}>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Publication Year:</strong> {book.year}</p>
              <p><strong>Average Score:</strong> {book.avgScore ? book.avgScore : 0}</p>
              
              {book?.currentOwner ? (
                <div className={styles.ownerInfo}>
                  <h3>Current Owner</h3>
                  <div className={styles.owner}>
                    <div className={styles.ownerImage}>
                      <Image 
                        src={book?.user?.image} 
                        alt={`${book?.user?.name} profil fotoğrafı`} 
                        width={60} 
                        height={60}
                        className={styles.avatar}
                      />
                    </div>
                    <div className={styles.ownerDetails}>
                      <Link href={`/users/${book?.currentOwner}`}>
                        <p className={styles.ownerName}>{book?.user?.name}</p>
                      </Link>
                      <p className={styles.ownerEmail}>{book?.user?.email}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className={styles.availability}><strong>State:</strong> <span className={styles.available}>Available</span></p>
              )}
            </div>
            
            <div className={styles.bookActions}>
              {!book?.currentOwner && (
                <button 
                  className={styles.borrowButton} 
                  onClick={handleBorrowClick}
                  disabled={isLoading}
                >
                  {isLoading ? 'In Progress...' : 'Borrow'}
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className={styles.bookDescription}>
          <h3>Book Description</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, 
            quis aliquam nisl nunc sit amet nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl 
            nunc sit amet nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc sit amet nisl.
          </p>
          <p>
            Suspendisse potenti. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. 
            Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi.
          </p>
        </div>
        
        {/* Özel Dialog Bileşeni */}
        {showDialog && (
          <div className={styles.dialogOverlay}>
            <div className={styles.dialogBox}>
              <p className={styles.dialogMessage}>{dialogMessage}</p>
              
              {dialogType === 'confirm' ? (
                <div className={styles.dialogButtons}>
                  <button 
                    className={styles.dialogConfirm} 
                    onClick={borrowBook}
                  >
                    Yes
                  </button>
                  <button 
                    className={styles.dialogCancel} 
                    onClick={() => setShowDialog(false)}
                  >
                    No
                  </button>
                </div>
              ) : (
                <div className={styles.dialogButtons}>
                  <button 
                    className={styles.dialogOk} 
                    onClick={() => setShowDialog(false)}
                  >
                    OK
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
} 