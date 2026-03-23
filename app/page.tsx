import { Suspense } from 'react';
import { connection } from 'next/server';
import { getLatestPublishedBlogs } from '@/lib/dal';
import HomepageClient from '@/components/homepage/HomepageClient';
import { Footer } from '@/components/layout/footer';

export default async function Home() {
  await connection();

  const blogs = await getLatestPublishedBlogs(3);

  return (
    <>
      <HomepageClient blogs={blogs} />
      <Suspense fallback={<div className="w-full h-64 bg-slate-100 animate-pulse" />}>
        <Footer />
      </Suspense>
    </>
  );
}
