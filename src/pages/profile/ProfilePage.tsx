import { useAppStore } from '../../app/store';
import { ProfileDetails } from '../../features/profile/ProfileDetails';

export function ProfilePage() {
  const user = useAppStore((state) => state.user);

  return (
    <div className="poster-page poster-page--profile">
      <div className="poster-page__copy poster-page__copy--centered poster-page__copy--compact">
        <p className="poster-page__eyebrow">Профиль сотрудника</p>
        <h1>{user?.fullName ?? 'ПРОФИЛЬ'}</h1>
      </div>
      <ProfileDetails />
    </div>
  );
}
