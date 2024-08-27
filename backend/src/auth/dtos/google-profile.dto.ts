import { UserRole } from '../../user/enums/user-role.enum';

export class GoogleProfileDto {
  email: string;
  username: string;
  role: UserRole;
  avatarUrl: string;
  accessToken: string;

  constructor(googleProfile: any, accessToken: string) {
    const { name, emails, photos } = googleProfile;
    this.email = emails[0].value;
    this.username = name.givenName + ' ' + name.familyName;
    this.role = UserRole.STUDENT; // Default role for users, consider adding a role selection business logic
    this.avatarUrl = photos[0].value;
    this.accessToken = accessToken;
  }
}
