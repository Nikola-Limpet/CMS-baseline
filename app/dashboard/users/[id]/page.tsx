import { notFound } from 'next/navigation';
import { getUserById } from '@/lib/dal';
import { EditUserForm } from '@/components/dashboard/users/EditUserForm';

interface UserEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserEditPage({ params }: UserEditPageProps) {
  const { id } = await params;
  const isNewUser = id === 'new';

  let user = null;
  if (!isNewUser) {
    user = await getUserById(id);
    if (!user) {
      notFound();
    }
  }

  return <EditUserForm user={user} isNewUser={isNewUser} />;
}
