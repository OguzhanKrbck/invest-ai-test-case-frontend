import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from '@/components/ThemeToggle';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, fetchUsers } from '../store/objectCacheThunks';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [mounted, setMounted] = useState(false);

  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.objectCache);
  
  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchUsers());
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Library Management System</title>
        <meta name="description" content="Library user management" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <header className={styles.header}>
          <h1 className={styles.title}>Library Management System</h1>
          <ThemeToggle />
        </header>
        
        <main className={styles.main}>
          <h2>User List</h2>
          
          <div className={styles.userGrid}>

            {users && users?.map((user) => (
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
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Membership Date:</strong> {new Date(user.createdAt).toLocaleDateString('tr-TR')}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
        <footer className={styles.footer}>
          <p>© 2025 Library Management System</p>
        </footer>
      </div>
    </>
  );
}
