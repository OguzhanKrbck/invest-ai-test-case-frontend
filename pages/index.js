import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";
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

export default function Home() {
  const [users] = useState(mockUsers);
  const { darkMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hidrojenizasyon sorunlarını önlemek için
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Kütüphane Yönetim Sistemi</title>
        <meta name="description" content="Kütüphane kullanıcı yönetimi" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <header className={styles.header}>
          <h1 className={styles.title}>Kütüphane Yönetim Sistemi</h1>
          <ThemeToggle />
        </header>
        
        <main className={styles.main}>
          <h2>Kullanıcı Listesi</h2>
          
          <div className={styles.userGrid}>
            {users.map((user) => (
              <Link href={`/users/${user.id}`} key={user.id} className={styles.userCardLink}>
                <div className={styles.userCard}>
                  <div className={styles.userImageContainer}>
                    <Image 
                      src={user.image} 
                      alt={`${user.name} profil fotoğrafı`} 
                      width={80} 
                      height={80} 
                      className={styles.userImage}
                    />
                  </div>
                  <div className={styles.userInfo}>
                    <h3>{user.name}</h3>
                    <p><strong>E-posta:</strong> {user.email}</p>
                    <p><strong>Üyelik Tarihi:</strong> {user.memberSince}</p>
                    <p><strong>Ödünç Alınan Kitap:</strong> {user.borrowedBooks}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
        <footer className={styles.footer}>
          <p>© 2025 Kütüphane Yönetim Sistemi</p>
        </footer>
      </div>
    </>
  );
}
