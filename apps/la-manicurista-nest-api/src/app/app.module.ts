import { Module } from '@nestjs/common';

// Custom modules
import { TypeaheadModule } from './shared/modules/typeahead/typeahead.module';

@Module({
  imports: [TypeaheadModule],
})
export class AppModule {}
