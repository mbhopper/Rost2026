import { Link } from 'react-router-dom';
import { useAppStore } from '../../app/store';
import { ProfileDetails } from '../../features/profile/ProfileDetails';
import { routes } from '../../shared/config/routes';

export function ProfilePage() {
  const user = useAppStore((state) => state.user);

  return (
    <section className="rt-screen rt-screen--profile motion-page-fade">
      <div className="rt-profile-title">
        {user?.fullName ?? 'Фамилия Имя Отчество'}
      </div>
      <ProfileDetails />
      <div className="rt-pedestal rt-pedestal--back">
        <span>НАЗАД НА ГЛАВНУЮ</span>
        <Link
          to={routes.dashboard}
          className="rt-pedestal__badge rt-pedestal__badge--back"
        >
          ↩
        </Link>
      </div>
    </section>
  );
}
