import { MongooseModule } from "@nestjs/mongoose";
import { ConfigService } from "../config/config.service";

export const databaseProviders = [
    MongooseModule.forRootAsync({
        useFactory: async (configService: ConfigService) => ({
            uri: configService.get('DATABASE_URI'),
            useNewUrlParser: true,
        }),
        inject: [ConfigService],
    })
];