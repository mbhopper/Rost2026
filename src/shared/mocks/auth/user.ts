import { USER_STATUSES } from '../../../entities/user/model';
import type { UserDto } from '../../api/dto';

export const mockUserDto: UserDto = {
  id: 'user-alex-ivanov',
  employee_id: 'EMP-1042',
  first_name: 'Александр',
  last_name: 'Иванов',
  middle_name: 'Сергеевич',
  email: 'alex.ivanov@futurepass.app',
  phone: '+7 (999) 555-01-42',
  department: 'Отдел цифровых платформ',
  position: 'Старший frontend-разработчик',
  avatar_url: 'https://api.dicebear.com/9.x/initials/svg?seed=%D0%90%D0%BB%D0%B5%D0%BA%D1%81%D0%B0%D0%BD%D0%B4%D1%80%20%D0%98%D0%B2%D0%B0%D0%BD%D0%BE%D0%B2',
  status: USER_STATUSES.ACTIVE,
};
