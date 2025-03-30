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

// Kitaplar için mock data
const mockBooks = [
  { id: 1, title: "Suç ve Ceza", author: "Fyodor Dostoyevski", coverImage: "https://picsum.photos/200/300?random=1", year: "1866", rating: 4.8 },
  { id: 2, title: "1984", author: "George Orwell", coverImage: "https://picsum.photos/200/300?random=2", year: "1949", rating: 4.7 },
  { id: 3, title: "Yüzüklerin Efendisi", author: "J.R.R. Tolkien", coverImage: "https://picsum.photos/200/300?random=3", year: "1954", rating: 4.9 },
  { id: 4, title: "Harry Potter", author: "J.K. Rowling", coverImage: "https://picsum.photos/200/300?random=4", year: "1997", rating: 4.6 },
  { id: 5, title: "Satranç", author: "Stefan Zweig", coverImage: "https://picsum.photos/200/300?random=5", year: "1942", rating: 4.5 },
  { id: 6, title: "Dönüşüm", author: "Franz Kafka", coverImage: "https://picsum.photos/200/300?random=6", year: "1915", rating: 4.4 },
  { id: 7, title: "Sefiller", author: "Victor Hugo", coverImage: "https://picsum.photos/200/300?random=7", year: "1862", rating: 4.7 },
  { id: 8, title: "Küçük Prens", author: "Antoine de Saint-Exupéry", coverImage: "https://picsum.photos/200/300?random=8", year: "1943", rating: 4.8 },
  { id: 9, title: "Cesur Yeni Dünya", author: "Aldous Huxley", coverImage: "https://picsum.photos/200/300?random=9", year: "1932", rating: 4.3 },
  { id: 10, title: "Simyacı", author: "Paulo Coelho", coverImage: "https://picsum.photos/200/300?random=10", year: "1988", rating: 4.5 },
  { id: 11, title: "Otomatik Portakal", author: "Anthony Burgess", coverImage: "https://picsum.photos/200/300?random=11", year: "1962", rating: 4.2 },
  { id: 12, title: "Bülbülü Öldürmek", author: "Harper Lee", coverImage: "https://picsum.photos/200/300?random=12", year: "1960", rating: 4.6 },
  { id: 13, title: "Fareler ve İnsanlar", author: "John Steinbeck", coverImage: "https://picsum.photos/200/300?random=13", year: "1937", rating: 4.4 },
  { id: 14, title: "Dorian Gray'in Portresi", author: "Oscar Wilde", coverImage: "https://picsum.photos/200/300?random=14", year: "1890", rating: 4.3 },
  { id: 15, title: "Hayvan Çiftliği", author: "George Orwell", coverImage: "https://picsum.photos/200/300?random=15", year: "1945", rating: 4.5 },
  { id: 16, title: "Uğultulu Tepeler", author: "Emily Brontë", coverImage: "https://picsum.photos/200/300?random=16", year: "1847", rating: 4.2 },
  { id: 17, title: "Aylak Adam", author: "Yusuf Atılgan", coverImage: "https://picsum.photos/200/300?random=17", year: "1959", rating: 4.3 },
  { id: 18, title: "Tutunamayanlar", author: "Oğuz Atay", coverImage: "https://picsum.photos/200/300?random=18", year: "1971", rating: 4.7 },
  { id: 19, title: "Kürk Mantolu Madonna", author: "Sabahattin Ali", coverImage: "https://picsum.photos/200/300?random=19", year: "1943", rating: 4.8 },
  { id: 20, title: "Bin Dokuz Yüz Seksen Dört", author: "George Orwell", coverImage: "https://picsum.photos/200/300?random=20", year: "1949", rating: 4.7 },
];

// Kullanıcılar için mock data
const mockUsers = [
  {
    id: 1,
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    memberSince: "2022-01-15",
    borrowedBooks: 3,
    image: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    id: 2,
    name: "Ayşe Demir",
    email: "ayse@example.com",
    memberSince: "2022-03-22",
    borrowedBooks: 1,
    image: "https://randomuser.me/api/portraits/women/2.jpg"
  },
  {
    id: 3,
    name: "Mehmet Kaya",
    email: "mehmet@example.com",
    memberSince: "2021-11-05",
    borrowedBooks: 5,
    image: "https://randomuser.me/api/portraits/men/3.jpg"
  },
  {
    id: 4,
    name: "Zeynep Şahin",
    email: "zeynep@example.com",
    memberSince: "2022-06-10",
    borrowedBooks: 2,
    image: "https://randomuser.me/api/portraits/women/4.jpg"
  },
  {
    id: 5,
    name: "Ali Öztürk",
    email: "ali@example.com",
    memberSince: "2021-08-17",
    borrowedBooks: 4,
    image: "https://randomuser.me/api/portraits/men/5.jpg"
  },
  {
    id: 6,
    name: "Fatma Yıldız",
    email: "fatma@example.com",
    memberSince: "2022-04-30",
    borrowedBooks: 0,
    image: "https://randomuser.me/api/portraits/women/6.jpg"
  },
];

// Ödünç alınan kitaplar için mock data
const mockBorrowedBooks = [
  { bookId: 1, userId: 1, borrowDate: '2023-10-15', returnDate: null },
  { bookId: 3, userId: 1, borrowDate: '2023-11-20', returnDate: null },
  { bookId: 5, userId: 1, borrowDate: '2023-12-05', returnDate: null },
  { bookId: 2, userId: 3, borrowDate: '2023-09-10', returnDate: null },
  { bookId: 4, userId: 3, borrowDate: '2023-10-22', returnDate: null },
  { bookId: 7, userId: 3, borrowDate: '2023-11-15', returnDate: null },
  { bookId: 9, userId: 3, borrowDate: '2023-12-01', returnDate: null },
  { bookId: 11, userId: 3, borrowDate: '2023-12-10', returnDate: null },
  { bookId: 6, userId: 4, borrowDate: '2023-10-30', returnDate: null },
  { bookId: 8, userId: 4, borrowDate: '2023-11-25', returnDate: null },
  { bookId: 10, userId: 5, borrowDate: '2023-09-05', returnDate: null },
  { bookId: 12, userId: 5, borrowDate: '2023-10-12', returnDate: null },
  { bookId: 14, userId: 5, borrowDate: '2023-11-08', returnDate: null },
  { bookId: 16, userId: 5, borrowDate: '2023-12-03', returnDate: null },
];

// Kitap için mevcut sahibi bulan fonksiyon
const findCurrentOwner = (bookId) => {
  const borrowRecord = mockBorrowedBooks.find(record => record.bookId === bookId && record.returnDate === null);
  if (!borrowRecord) return null;
  
  return mockUsers.find(user => user.id === borrowRecord.userId);
};

export default function BookDetail() {
  const router = useRouter();
  const { id } = router.query;
  const bookId = parseInt(id);
  const { darkMode } = useTheme();
  
  const [book, setBook] = useState(null);
  const [currentOwner, setCurrentOwner] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!isNaN(bookId)) {
      const foundBook = mockBooks.find(b => b.id === bookId);
      if (foundBook) {
        setBook(foundBook);
        // Kitabın mevcut sahibini bul
        const owner = findCurrentOwner(bookId);
        setCurrentOwner(owner);
      }
    }
  }, [bookId]);
  
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
        <title>{book.title} - Kitap Detayları</title>
        <meta name="description" content={`${book.title} kitap bilgileri`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${styles.container} ${geistSans.variable} ${geistMono.variable}`}>
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Ana Sayfaya Dön
          </Link>
          <h1 className={styles.title}>Kitap Detayları</h1>
          <div className={styles.headerRight}>
            <ThemeToggle />
          </div>
        </header>
        
        <div className={styles.bookDetail}>
          <div className={styles.bookImage}>
            <Image 
              src={book.coverImage} 
              alt={`${book.title} kapak resmi`} 
              width={300} 
              height={450}
              className={styles.cover}
            />
          </div>
          <div className={styles.bookInfo}>
            <h2 className={styles.bookTitle}>{book.title}</h2>
            <div className={styles.bookMeta}>
              <p><strong>Yazar:</strong> {book.author}</p>
              <p><strong>Yayın Yılı:</strong> {book.year}</p>
              <div className={styles.ratingContainer}>
                <strong>Ortalama Puan:</strong> {renderStars(book.rating)}
              </div>
              
              {currentOwner ? (
                <div className={styles.ownerInfo}>
                  <h3>Mevcut Sahibi</h3>
                  <div className={styles.owner}>
                    <div className={styles.ownerImage}>
                      <Image 
                        src={currentOwner.image} 
                        alt={`${currentOwner.name} profil fotoğrafı`} 
                        width={60} 
                        height={60}
                        className={styles.avatar}
                      />
                    </div>
                    <div className={styles.ownerDetails}>
                      <Link href={`/users/${currentOwner.id}`}>
                        <p className={styles.ownerName}>{currentOwner.name}</p>
                      </Link>
                      <p className={styles.ownerEmail}>{currentOwner.email}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className={styles.availability}><strong>Durum:</strong> <span className={styles.available}>Mevcut</span></p>
              )}
            </div>
            
            <div className={styles.bookActions}>
              {!currentOwner && (
                <button className={styles.borrowButton}>
                  Ödünç Al
                </button>
              )}
              <button className={styles.favoriteButton}>
                Favorilere Ekle
              </button>
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
      </div>
    </>
  );
} 