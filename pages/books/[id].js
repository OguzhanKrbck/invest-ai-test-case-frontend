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

  // Ödünç alma işlemi için onay dialogunu göster
  const handleBorrowClick = () => {
    setDialogType('confirm');
    setDialogMessage(`"${book.name}" kitabını ödünç almak istediğinize emin misiniz?`);
    setShowDialog(true);
  };

  // Ödünç alma işlemini gerçekleştir
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
        setDialogMessage('Kitap başarıyla ödünç alındı!');
        setShowDialog(true);
        await fetchBookData(bookId); // Kitap verilerini güncelle
      } else {
        const error = await response.json();
        setDialogType('result');
        setDialogMessage(`Hata: ${error.message || 'Kitap ödünç alınamadı'}`);
        setShowDialog(true);
      }
    } catch (error) {
      console.error('Ödünç alma işlemi sırasında hata:', error);
      setDialogType('result');
      setDialogMessage('Kitap ödünç alınırken bir hata oluştu.');
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
  
  if (!mounted || !book) {
    return <div className={styles.loading}>Yükleniyor...</div>;
  }
  
  // Yıldız puanı gösterimi için fonksiyon
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className={styles.stars}>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className={styles.star}>★</span>
        ))}
        {hasHalfStar && <span className={styles.star}>☆</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className={styles.emptyStar}>☆</span>
        ))}
        <span className={styles.ratingValue}>({book.rating})</span>
      </div>
    );
  };
  
  return (
    <>
      <Head>
        <title>{book.name} - Kitap Detayları</title>
        <meta name="description" content={`${book.name} kitap bilgileri`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={`${styles.container} ${geistSans.variable} ${geistMono.variable}`}>
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Ana Sayfaya Dön
          </Link>
          <h1 className={styles.name}>Kitap Detayları</h1>
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
              <p><strong>Yazar:</strong> {book.author}</p>
              <p><strong>Yayın Yılı:</strong> {book.year}</p>
              <p><strong>Ortalama Skor:</strong> {book.avgScore ? book.avgScore : 0}</p>
              
              {book?.currentOwner ? (
                <div className={styles.ownerInfo}>
                  <h3>Mevcut Sahibi</h3>
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
                <p className={styles.availability}><strong>Durum:</strong> <span className={styles.available}>Mevcut</span></p>
              )}
            </div>
            
            <div className={styles.bookActions}>
              {!book?.currentOwner && (
                <button 
                  className={styles.borrowButton} 
                  onClick={handleBorrowClick}
                  disabled={isLoading}
                >
                  {isLoading ? 'İşlem yapılıyor...' : 'Ödünç Al'}
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className={styles.bookDescription}>
          <h3>Kitap Açıklaması</h3>
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
                    Evet
                  </button>
                  <button 
                    className={styles.dialogCancel} 
                    onClick={() => setShowDialog(false)}
                  >
                    Hayır
                  </button>
                </div>
              ) : (
                <div className={styles.dialogButtons}>
                  <button 
                    className={styles.dialogOk} 
                    onClick={() => setShowDialog(false)}
                  >
                    Tamam
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