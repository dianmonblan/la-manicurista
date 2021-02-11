import { Module } from '@nestjs/common';

// Custom controllers
import { TypeaheadController } from './typeahead.controller';

// Custom shared
import { TypeaheadService } from '@la-manicurista/shared';

@Module({
  imports: [],
  controllers: [TypeaheadController],
  providers: [TypeaheadService],
})
export class TypeaheadModule {}
