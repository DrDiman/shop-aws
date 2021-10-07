import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { checkPaths } from './middlewares/check-paths.middleware';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.use(helmet());
  app.use(checkPaths());
  await app.listen(port);
}
bootstrap().then(() => {
  console.log('App is running on %s port', port);
});
