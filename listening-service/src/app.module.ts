import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { ListeningTopicModule } from './listening-topic/listening-topic.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { FilesModule } from './files/files.module';
import { ListeningExerciseModule } from './listening-exercises/listening-exercises.module';
import { ListeningQuestionModule } from './listening-question/listening-question.module';
import { ListeningSubmitModule } from './listening-submit/listening-submit.module';
import { ListeningResultModule } from './listening-result/listening-result.module';
import { StatsModule } from './common/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const db = configService.get('database'); // ⬅️ lấy config

        return {
          type: 'mysql',
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          database: db.database,
          autoLoadEntities: true,
          synchronize: true,
        };
      }
    }),
    ListeningTopicModule,
    CloudinaryModule,
    FilesModule,
    ListeningExerciseModule,
    ListeningQuestionModule,
    ListeningSubmitModule,
    ListeningResultModule,
    StatsModule,
  ],
})
export class AppModule {}
