import React from 'react'
import Head from 'next/head'
import NavigationBar from '@/components/Navigation';
import Footer from '@/components/Footer';

const layout = ({ children }: any) => {
    return (
        <>
            <Head>
                <title>Bảo Bảo Cipher</title>
                <meta name="description" content="Tool mã hóa miễn phí" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <NavigationBar />
            <main>{children}</main>
            <Footer />

        </>
    )
}

export default layout
