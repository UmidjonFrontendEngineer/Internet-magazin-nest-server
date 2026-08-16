import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { MarketsModule } from './markets/markets.module';
import { ProductsModule } from './products/products.module';
import { CommentsModule } from './comments/comments.module';
import { OrdersModule } from './orders/orders.module';
import { ReactionsModule } from './reactions/reactions.module';
import { DiscountsModule } from './discounts/discounts.module';
import { SlidersModule } from './sliders/sliders.module';
import { FeatureRequestsModule } from './feature-requests/feature-requests.module';
import { AuthModule } from './auth/auth.module';
import { FollowingsModule } from './followings/followings.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VacanciesModule } from './vacancies/vacancies.module';
import { WorkersModule } from './workers/workers.module';
import { WherehousesModule } from './wherehouses/wherehouses.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseModule,
        UsersModule,
        MarketsModule,
        ProductsModule,
        CommentsModule,
        OrdersModule,
        ReactionsModule,
        DiscountsModule,
        SlidersModule,
        FeatureRequestsModule,
        AuthModule,
        FollowingsModule,
        VacanciesModule,
        WorkersModule,
        WherehousesModule,
        CategoriesModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule { }