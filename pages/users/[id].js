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

// Her kullanıcı için kullanıcının ödünç aldığı kitapları getiren fonksiyon
const getUserBooks = (userId) => {
  // Gerçek bir uygulamada burada bir API çağrısı olurdu
  const currentlyBorrowed = [];
  const previouslyBorrowed = [];
  const availableBooks = [];
  
  // Rastgele seçilen kitaplar (gerçek uygulamada bu mantık daha farklı olurdu)
  const shuffledBooks = [...mockBooks].sort(() => 0.5 - Math.random());
  
  // Şu anda ödünç alınan kitaplar
  const borrowedCount = mockUsers.find(u => u.id === userId)?.borrowedBooks || 0;
  for (let i = 0; i < borrowedCount && i < 10; i++) {
    currentlyBorrowed.push(shuffledBooks[i]);
  }
  
  // Önceden ödünç alınan kitaplar
  for (let i = 10; i < 15 && i < shuffledBooks.length; i++) {
    previouslyBorrowed.push(shuffledBooks[i]);
  }
  
  // Ödünç alınabilecek kitaplar
  // NOT: shuffledBooks dizisi 20 eleman içerdiğinden, 20-30 arası indexler boş dönüyordu
  // Bu nedenle kitap sayısına göre farklı bir aralık kullanıyoruz
  for (let i = 15; i < shuffledBooks.length; i++) {
    availableBooks.push(shuffledBooks[i]);
  }
  
  return {
    currentlyBorrowed: currentlyBorrowed.slice(0, 10),
    previouslyBorrowed: previouslyBorrowed.slice(0, 10),
    availableBooks: availableBooks.slice(0, 10)
  };
};

export default function UserDetail() {
  const router = useRouter();
  const { id } = router.query;
  const userId = parseInt(id);
  
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState({
    currentlyBorrowed: [],
    previouslyBorrowed: [],
    availableBooks: []
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!isNaN(userId)) {
      const foundUser = mockUsers.find(u => u.id === userId);
      if (foundUser) {
        setUser(foundUser);
        setBooks(getUserBooks(userId));
      }
    }
  }, [userId]);
  
  if (!mounted || !user) {
    return <div className={styles.loading}>Yükleniyor...</div>;
  }
  
  return (
    <>
      <Head>
        <title>{user.name} - Kullanıcı Detayları</title>
        <meta name="description" content={`${user.name} kullanıcı bilgileri`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${styles.container} ${geistSans.variable} ${geistMono.variable}`}>
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Ana Sayfaya Dön
          </Link>
          <h1 className={styles.title}>Kullanıcı Detayları</h1>
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
            <p><strong>E-posta:</strong> {user.email}</p>
            <p><strong>Üyelik Tarihi:</strong> {user.memberSince}</p>
            <p><strong>Ödünç Alınan Kitap Sayısı:</strong> {user.borrowedBooks}</p>
          </div>
        </div>
        
        <div className={styles.bookSections}>
          <section className={styles.section}>
            <h3>Şu Anda Ödünç Aldığı Kitaplar</h3>
            {books.currentlyBorrowed.length > 0 ? (
              <div className={styles.bookGrid}>
                {books.currentlyBorrowed.map(book => (
                  <Link href={`/books/${book.id}`} key={book.id}>
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
                        <h4>{book.title}</h4>
                        <p>{book.author}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className={styles.emptyMessage}>Şu anda ödünç aldığı kitap bulunmuyor.</p>
            )}
          </section>
          
          <section className={styles.section}>
            <h3>Önceden Ödünç Aldığı Kitaplar</h3>
            {books.previouslyBorrowed.length > 0 ? (
              <div className={styles.bookGrid}>
                {books.previouslyBorrowed.map(book => (
                  <Link href={`/books/${book.id}`} key={book.id}>
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
                        <h4>{book.title}</h4>
                        <p>{book.author}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className={styles.emptyMessage}>Önceden ödünç aldığı kitap bulunmuyor.</p>
            )}
          </section>
          
          <section className={styles.section}>
            <h3>Ödünç Alabileceği Kitaplar</h3>
            <div className={styles.bookGrid}>
              {books.availableBooks.map(book => (
                <Link href={`/books/${book.id}`} key={book.id}>
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
                      <h4>{book.title}</h4>
                      <p>{book.author}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
} 