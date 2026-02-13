import { UserRole } from '../../user/enums/userRole.enum';
import { UserEntity } from '../../user/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class AdminSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userRepository = dataSource.getRepository(UserEntity);
    const admin = {
      name: 'admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      phone: process.env.ADMIN_PHONE,
      role: UserRole.ADMIN
    };

    const user = await userRepository.findOne({
      where: {
        email: process.env.ADMIN_EMAIL
      }
    });
    if (user){
      console.log('Admin already exists');
      return;
    }

    const newAdmin = userRepository.create(admin);
    await userRepository.save(newAdmin);
  }
}
