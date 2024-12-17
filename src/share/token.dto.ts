import { ApiProperty } from '@nestjs/swagger';

export class IntrospectDto {
  @ApiProperty({
    description: 'The token to introspect',
    type: String,
  })
  token: string;
}