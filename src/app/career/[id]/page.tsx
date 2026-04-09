import { CAREERS } from '@/data/careers';
import CareerDetailClient from './CareerDetailClient';

export function generateStaticParams() {
  return CAREERS.map((career) => ({
    id: career.id,
  }));
}

export default function Page({ params }: { params: { id: string } }) {
  return <CareerDetailClient id={params.id} />;
}