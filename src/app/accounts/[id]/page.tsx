import AccountDetailScreen from '@/features/accounts/AccountDetailScreen';

export default function AccountDetailPage({ params }: { params: { id: string } }) {
  return <AccountDetailScreen accountId={params.id} />;
}