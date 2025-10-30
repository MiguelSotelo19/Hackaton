// src/app/marketplace/page.tsx
import ComprarTokens from '@/components/ComprarTokens';

export default function MarketplacePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
      <ComprarTokens />
    </main>
  );
}