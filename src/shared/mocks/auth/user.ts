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
  department: 'Platform Engineering',
  position: 'Senior Frontend Engineer',
  avatar_url: 'https://api.dicebear.com/9.x/initials/svg?seed=Alexander%20Ivanov',
  status: USER_STATUSES.ACTIVE,
};
